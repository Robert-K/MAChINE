import React from 'react'
import { Box, Button, Grid, TextField } from '@mui/material'
import ModelDetailsCard from '../components/training/ModelDetailsCard'
import DatasetDetailsCard from '../components/training/DatasetDetailsCard'
import { useNavigate } from 'react-router-dom'
import TrainingContext from '../context/TrainingContext'

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
      console.log(startStopButton)
      console.log(training.trainingStatus)
    } else {
      setStartStopButton(stop)
      training.setTrainingStatus(true)
    }
  }

  const navigate = useNavigate()

  return (
    <Grid container>
      <Grid xs={6}>
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
        <Box sx={{ m: 2, background: 'black', height: 400 }}></Box>
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
      </Grid>
    </Grid>
  )
}
