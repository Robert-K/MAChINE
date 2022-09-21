import React from 'react'
import { Box, Button, Grid, TextField } from '@mui/material'
import ModelDetailsCard from '../components/training/ModelDetailsCard'
import DatasetDetailsCard from '../components/training/DatasetDetailsCard'
import { useLocation, useNavigate } from 'react-router-dom'

export default function TrainingPage() {
  const { state } = useLocation()
  const { selectedModel, selectedDataset, selectedLabels } = state
  console.log(selectedModel, selectedDataset, selectedLabels)

  const [epochs, setEpochs] = React.useState(1000)
  const handleEpochsChange = (event) => {
    setEpochs(event.target.value)
  }
  const [batchsize, setBatchSize] = React.useState(64)
  const handlebatchsizeChange = (event2) => {
    setBatchSize(event2.target.value)
  }

  const start = 'Start'
  const stop = 'Stop'
  const [startStopButton, setStartStopButton] = React.useState(start)
  const handleStartStop = () => {
    if (startStopButton === start) {
      setStartStopButton(stop)
    } else {
      setStartStopButton(start)
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
        <ModelDetailsCard selectedModel={selectedModel} />
        <DatasetDetailsCard
          selectedDataset={selectedDataset}
          selectedLabels={selectedLabels}
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
