import React, { useEffect } from 'react'
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
  const [epochsError, setEpochsError] = React.useState(false)
  const handleEpochsChange = (event) => {
    const tempEpochs = event.target.value
    setEpochs(tempEpochs)
    if (tempEpochs > 0) {
      // TODO: Add allowed range of values
      setEpochsError(false)
    } else {
      setEpochsError(true)
    }
  }

  const [batchSize, setBatchSize] = React.useState(64)
  const [batchSizeError, setBatchSizeError] = React.useState(false)
  const handleBatchSizeChange = (event) => {
    const tempBatchSize = event.target.value
    setBatchSize(tempBatchSize)
    if (tempBatchSize > 0) {
      // TODO: Add allowed range of values
      setBatchSizeError(false)
    } else {
      setBatchSizeError(true)
    }
  }

  const training = React.useContext(TrainingContext)
  const [startStopButton, setStartStopButton] = React.useState('Start')

  useEffect(() => {
    if (training.trainingStatus === true) {
      setStartStopButton('Stop')
    } else {
      setStartStopButton('Start')
    }
  }, [training.trainingStatus])

  const handleStartStop = () => {
    if (training.trainingStatus === true) {
      training.setTrainingStatus(false)
      // TODO: Send abort training command to backend
    } else {
      training.setTrainingStatus(true)
      api.trainModel(
        training.selectedDataset.datasetID,
        training.selectedModel.id,
        training.selectedLabels,
        epochs,
        batchSize
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
          defaultValue={epochs}
          onChange={handleEpochsChange}
          error={epochsError}
          helperText={epochsError ? 'Required!' : ' '}
        />
        <TextField
          sx={{ mx: 3, mt: 3 }}
          required
          id="batchsize"
          label="Batch Size"
          type="number"
          defaultValue={batchSize}
          onChange={handleBatchSizeChange}
          error={batchSizeError}
          helperText={batchSizeError ? 'Required!' : ' '}
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
        <Button
          variant="outlined"
          disabled={epochsError || batchSizeError}
          sx={{ m: 2 }}
          onClick={handleStartStop}
        >
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
