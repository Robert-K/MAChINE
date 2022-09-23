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
import HelpContext from '../context/HelpContext'
import HelpPopper from '../components/shared/HelpPopper'

export default function TrainingPage() {
  const training = React.useContext(TrainingContext)
  const [loadTraining, setLoadTraining] = React.useState(false)
  const [showDialog, setShowDialog] = React.useState(false)
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)

  const [epochsError, setEpochsError] = React.useState(false)
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
      setLoadTraining(true)
      api.trainModel(
        training.selectedDataset.datasetID,
        training.selectedModel.id,
        training.selectedLabels,
        training.selectedEpochs,
        training.selectedBatchSize
      )
    }
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
  }

  const abortTraining = () => {
    api.stopTraining()
    handleCloseDialog()
  }

  const navigate = useNavigate()

  const handleHelpPopperOpen = (event, content) => {
    setHelpAnchorEl(event.currentTarget)
    setHelpPopperContent(content)
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
  }

  const helpOpen = Boolean(helpAnchorEl)

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
          defaultValue={training.selectedEpochs}
          disabled={training.trainingStatus}
          onChange={handleEpochsChange}
          error={epochsError}
          helperText={epochsError ? 'Required!' : ' '}
          onMouseOver={(e) => {
            if (help.helpMode) {
              handleHelpPopperOpen(
                e,
                'This determines how long your model is trained. In each epoch, the entire dataset is passed through your net once!'
              )
            }
          }}
          onMouseLeave={handleHelpPopperClose}
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
          onMouseOver={(e) => {
            if (help.helpMode) {
              handleHelpPopperOpen(
                e,
                "The batch size determines how often the net's parameters are adjusted. The smaller the batch size, the more often that's the case!"
              )
            }
          }}
          onMouseLeave={handleHelpPopperClose}
        />
        <ModelDetailsCard
          selectedModel={training.selectedModel}
          hoverFunc={(e) => {
            if (help.helpMode) {
              handleHelpPopperOpen(
                e,
                'Here you can see basic information about your model. Among them are your chosen values for the optimizer, the loss, and other model-specific data.'
              )
            }
          }}
          leaveFunc={handleHelpPopperClose}
        />
        <DatasetDetailsCard
          selectedDataset={training.selectedDataset}
          selectedLabels={training.selectedLabels}
          hoverFunc={(e) => {
            if (help.helpMode) {
              handleHelpPopperOpen(
                e,
                'Here you can see basic information about your chosen dataset. Most importantly, how big your dataset is, and which label you chose to train on!'
              )
            }
          }}
          leaveFunc={handleHelpPopperClose}
        />
      </Grid>
      <Grid item xs={6}>
        <Box
          onMouseOver={(e) => {
            if (help.helpMode) {
              handleHelpPopperOpen(
                e,
                'This chart shows the progression of your model in training. On the x-axis, you can see for how long your model has been trained. Take a look at the different functions: They tell you how good your model is in predicting data from the dataset. For loss: The lower, the better! For r-squared: The closer to 1, the better (and a negative value is very bad). Have fun analyzing your model with these functions!'
              )
            }
          }}
          onMouseLeave={handleHelpPopperClose}
        >
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
        <Box sx={{ flexGrow: 1 }}></Box>
        <Button
          variant="outlined"
          sx={{ m: 2 }}
          onClick={() => navigate('/molecules')}
        >
          Continue to Molecules
        </Button>
      </Grid>
      <HelpPopper
        id="helpPopper"
        helpPopperContent={helpPopperContent}
        open={helpOpen}
        anchorEl={helpAnchorEl}
        onClose={handleHelpPopperClose}
      />
    </Grid>
  )
}
