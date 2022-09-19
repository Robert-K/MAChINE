import React from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material'
import ModelDetailsCard from '../components/training/ModelDetailsCard'
import DatasetDetailsCard from '../components/training/DatasetDetailsCard'
import { useNavigate } from 'react-router-dom'
import TrainingContext from '../context/TrainingContext'
import api from '../api'
import PrettyChart from '../components/training/PrettyChart'
import SnackBarAlert from '../components/misc/SnackBarAlert'

export default function TrainingPage() {
  const training = React.useContext(TrainingContext)
  const [epochsError, setEpochsError] = React.useState(false)
  const [batchSizeError, setBatchSizeError] = React.useState(false)
  const [startStopButton, setStartStopButton] = React.useState('Start')
  const [loadTraining, setLoadTraining] = React.useState(false)
  const [showDialog, setShowDialog] = React.useState(false)
  const [openSnackError, setOpenSnackError] = React.useState(false)

  const checkEpochs = (epochs) => {
    if (epochs > 0) {
      setEpochsError(false)
    } else {
      setEpochsError(true)
    }
  }

  const checkBatchSize = (batchSize) => {
    if (batchSize > 0) {
      setBatchSizeError(false)
    } else {
      setBatchSizeError(true)
    }
  }

  const initialMount = React.useRef(true)

  React.useEffect(() => {
    checkBatchSize(training.selectedBatchSize)
    if (initialMount.current) {
      initialMount.current = false
    } else {
      training.setTrainingFinished(false)
    }
    return () => {
      training.setTrainingFinished(false)
    }
  }, [training.selectedBatchSize])

  React.useEffect(() => {
    checkEpochs(training.selectedEpochs)
  }, [training.selectedEpochs])

  React.useEffect(() => {
    if (training.trainingStatus) {
      setLoadTraining(false)
      setStartStopButton('Stop')
    } else {
      setShowDialog(false)
      setStartStopButton('Start')
    }
  }, [training.trainingStatus])

  const handleStartStop = () => {
    if (training.trainingStatus) {
      setShowDialog(true)
    } else {
      training.softResetContext()
      setLoadTraining(true)
      api
        .trainModel(
          training.selectedDataset.datasetID,
          training.selectedModel.id,
          training.selectedLabels,
          training.selectedEpochs,
          training.selectedBatchSize
        )
        .then((response) => {
          setOpenSnackError(!response)
          setLoadTraining(response)
        })
    }
  }

  const handleAdditionalTraining = () => {
    setLoadTraining(true)
    api
      .continueTraining(training.trainingID, training.selectedEpochs)
      .then((response) => {
        setOpenSnackError(!response)
        setLoadTraining(response)
      })
    // TODO: Start additional training
    // TODO: training.selectedEpochs auf den Wert der insgesamt trainierten Epochen setzen
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
  }

  const abortTraining = () => {
    training.stopTraining()
    handleCloseDialog()
  }

  const navigate = useNavigate()

  function filterData(data) {
    // Change this to exclude more data
    const excludedPoints = ['epoch']
    const newData = []
    Object.entries(data).forEach(([dataName, values], index) => {
      if (excludedPoints.indexOf(dataName) === -1) {
        console.log('aah')
        if (values.length === 1) {
          values = [...values, ...values]
        }
        newData.push({ name: dataName, data: values })
      }
    })
    return newData
  }

  return (
    <Grid container>
      <Grid item xs={6}>
        <TextField
          sx={{ mx: 3, mt: 3 }}
          required
          id="epochs"
          label="Epochs"
          type="number"
          value={training.selectedEpochs}
          disabled={training.trainingStatus}
          onChange={(event) => training.setSelectedEpochs(event.target.value)}
          error={epochsError}
          helperText={epochsError ? 'Required!' : ' '}
        />
        <TextField
          sx={{ mx: 3, mt: 3 }}
          required
          id="batchsize"
          label="Batch Size"
          type="number"
          value={training.selectedBatchSize}
          disabled={training.trainingStatus}
          onChange={(event) =>
            training.setSelectedBatchSize(event.target.value)
          }
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
          <PrettyChart data={filterData(training.trainingData)} />
        </Box>
        <Button
          variant="outlined"
          disabled={epochsError || batchSizeError}
          sx={{ m: 2 }}
          onClick={handleStartStop}
        >
          {startStopButton}
          {!loadTraining ? null : (
            <CircularProgress size="16px" sx={{ ml: 1 }} />
          )}
        </Button>
        <Dialog open={showDialog} onClose={handleCloseDialog}>
          <DialogTitle>{'Abort current training?'}</DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={abortTraining}>Abort</Button>
          </DialogActions>
        </Dialog>
        {!training.trainingFinished ? null : (
          <Button
            variant="outlined"
            disabled={epochsError}
            sx={{ m: 2 }}
            onClick={handleAdditionalTraining}
          >
            Train additional {training.selectedEpochs} epochs
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }}></Box>
        <Button
          variant="outlined"
          sx={{ m: 2 }}
          onClick={() => navigate('/molecules')}
        >
          Continue to Molecules
        </Button>
      </Grid>
      <SnackBarAlert
        open={openSnackError}
        onClose={() => setOpenSnackError(false)}
        severity="error"
        message="Someone is already training right now. Please try again later"
      />
    </Grid>
  )
}
