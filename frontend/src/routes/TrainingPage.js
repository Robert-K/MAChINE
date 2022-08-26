import React from 'react'
import { Box, Button, Grid, TextField } from '@mui/material'
import ModelDetailsCard from '../components/training/ModelDetailsCard'
import DatasetDetailsCard from '../components/training/DatasetDetailsCard'
import { useNavigate } from 'react-router-dom'
import TrainingContext from '../context/TrainingContext'
import io from 'socket.io-client'
import api from '../api'

const socket = io(`ws://${api.getServerAddress()}:${api.getServerPort()}`)

export default function TrainingPage() {
  const [epochs, setEpochs] = React.useState(1000)
  const handleEpochsChange = (event) => {
    setEpochs(event.target.value)
  }
  const [batchsize, setBatchSize] = React.useState(64)
  const handlebatchsizeChange = (event) => {
    setBatchSize(event.target.value)
  }

  const training = React.useContext(TrainingContext)
  const start = 'Start'
  const stop = 'Stop'
  const [startStopButton, setStartStopButton] = React.useState(start)

  const handleStartStop = () => {
    if (training.trainingStatus === true) {
      setStartStopButton(start)
      training.setTrainingStatus(false)
      // TODO: Send abort training command to backend
    } else {
      setStartStopButton(stop)
      training.setTrainingStatus(true)
      api.trainModel(
        training.selectedDataset.datasetID,
        training.selectedModel.modelID,
        training.selectedLabels,
        epochs,
        batchsize
      )
    }
  }

  const [isConnected, setIsConnected] = React.useState(socket.connected)
  const [lastPong, setLastPong] = React.useState(null)

  React.useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('pong', (answer) => {
      setLastPong(answer)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('pong')
    }
  }, [])

  const sendPing = (text) => {
    socket.emit('ping', text)
  }

  const navigate = useNavigate()

  return (
    <Grid container>
      <Grid item xs={6}>
        <TextField
          sx={{ mx: 3, mt: 3 }}
          required
          id="epochs"
          label="Epochs"
          type="number"
          onChange={handleEpochsChange}
          defaultValue={epochs}
        />
        <TextField
          sx={{ mx: 3, mt: 3 }}
          required
          id="batchsize"
          label="Batch Size"
          type="number"
          defaultValue={batchsize}
          onChange={handlebatchsizeChange}
        />
        <ModelDetailsCard selectedModel={training.selectedModel} />
        <DatasetDetailsCard
          selectedDataset={training.selectedDataset}
          selectedLabels={training.selectedLabels}
        />
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ m: 2, background: 'grey', height: 400 }}>
          {lastPong}
          {isConnected}
        </Box>
        <Button variant="outlined" sx={{ m: 2 }} onClick={handleStartStop}>
          {startStopButton}
        </Button>
        <Button
          variant="outlined"
          sx={{ m: 2 }}
          onClick={() => navigate('/molecules')}
        >
          Continue to Molecules
        </Button>
        <Button
          variant="outlined"
          sx={{ m: 2 }}
          onClick={() => {
            sendPing('hallo')
          }}
        >
          ping
        </Button>
      </Grid>
    </Grid>
  )
}
