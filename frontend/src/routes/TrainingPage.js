import React, { useEffect } from 'react'
import { Box, Button, Grid, TextField, useTheme } from '@mui/material'
import ModelDetailsCard from '../components/training/ModelDetailsCard'
import DatasetDetailsCard from '../components/training/DatasetDetailsCard'
import { useNavigate } from 'react-router-dom'
import TrainingContext from '../context/TrainingContext'
import api from '../api'
import Chart from 'react-apexcharts'

export default function TrainingPage() {
  const training = React.useContext(TrainingContext)

  const [epochsError, setEpochsError] = React.useState(false)

  const theme = useTheme()

  const handleEpochsChange = (event) => {
    const tempEpochs = event.target.value
    training.setSelectedEpochs(tempEpochs)
    if (tempEpochs > 0) {
      // TODO: Add allowed range of values
      setEpochsError(false)
    } else {
      setEpochsError(true)
    }
  }

  const [batchSizeError, setBatchSizeError] = React.useState(false)
  const handleBatchSizeChange = (event) => {
    const tempBatchSize = event.target.value
    training.setSelectedBatchSize(tempBatchSize)
    if (tempBatchSize > 0) {
      // TODO: Add allowed range of values
      setBatchSizeError(false)
    } else {
      setBatchSizeError(true)
    }
  }

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
      api.stopTraining()
    } else {
      api.trainModel(
        training.selectedDataset.datasetID,
        training.selectedModel.id,
        training.selectedLabels,
        training.selectedEpochs,
        training.selectedBatchSize
      )
    }
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
          defaultValue={training.selectedEpochs}
          disabled={training.trainingStatus}
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
          defaultValue={training.selectedBatchSize}
          disabled={training.trainingStatus}
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
        <Box>
          <Chart
            options={{
              stroke: { curve: 'smooth' },
              dataLabels: { enabled: false },
              fill: {
                type: 'gradient',
                gradient: {
                  shade: theme.apexcharts.shade,
                  shadeIntensity: 1,
                  opacityFrom: 0.7,
                  opacityTo: 0.9,
                  stops: [0, 90, 100],
                },
              },
              theme: { mode: theme.apexcharts.shade },
              chart: {
                background: 'transparent',
                toolbar: { show: false },
                animations: {
                  enabled: true,
                  easing: 'linear',
                  dynamicAnimation: {
                    speed: 1000,
                  },
                },
              },
              colors: [theme.palette.primary.main],
              yaxis: {
                labels: {
                  formatter(val, opts) {
                    return val.toFixed(3)
                  },
                },
              },
            }}
            series={[{ data: training.trainingData.val_r_square }]}
            width="100%"
            type="area"
          />
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
      </Grid>
    </Grid>
  )
}
