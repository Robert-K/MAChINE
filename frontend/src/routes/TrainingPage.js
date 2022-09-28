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
  Typography,
  useTheme,
} from '@mui/material'
import ModelDetailsCard from '../components/training/ModelDetailsCard'
import DatasetDetailsCard from '../components/training/DatasetDetailsCard'
import { useNavigate } from 'react-router-dom'
import TrainingContext from '../context/TrainingContext'
import api from '../api'
import PrettyChart from '../components/training/PrettyChart'
import SnackBarAlert from '../components/misc/SnackBarAlert'
import HelpContext from '../context/HelpContext'
import HelpPopper from '../components/shared/HelpPopper'

export default function TrainingPage() {
  const training = React.useContext(TrainingContext)
  const [localEpochs, setLocalEpochs] = React.useState(training.selectedEpochs)
  const [showDialog, setShowDialog] = React.useState(false)
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)
  const [epochsError, setEpochsError] = React.useState(false)
  const [batchSizeError, setBatchSizeError] = React.useState(false)
  const [startStopButton, setStartStopButton] = React.useState('Start')
  const [loadTraining, setLoadTraining] = React.useState(false)
  const [openSnackError, setOpenSnackError] = React.useState(false)
  const [showFinishDialog, setShowFinishDialog] = React.useState(false)
  const theme = useTheme()

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
    checkEpochs(localEpochs)
  }, [localEpochs])

  React.useEffect(() => {
    setLocalEpochs(training.selectedEpochs)
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

  React.useEffect(() => {
    setShowFinishDialog(training.trainingFinished)
  }, [training.trainingFinished])

  const handleStartStop = () => {
    if (training.trainingStatus) {
      setShowDialog(true)
    } else {
      training.softResetContext()
      setLoadTraining(true)
      training.setSelectedEpochs(localEpochs)
      api
        .trainModel(
          training.selectedDataset.datasetID,
          training.selectedModel.id,
          training.selectedLabels,
          localEpochs,
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
    api.continueTraining(training.trainingID, localEpochs).then((response) => {
      setOpenSnackError(!response)
      setLoadTraining(response)
    })
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
  }

  const handleCloseFinishDialog = () => {
    setShowFinishDialog(false)
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
        if (values.length === 1) {
          values = [...values, ...values]
        }
        newData.push({ name: dataName, data: values })
      }
    })
    return newData
  }

  const handleHelpPopperOpen = (event, content) => {
    if (help.helpMode) {
      setHelpAnchorEl(event.currentTarget)
      setHelpPopperContent(content)
    }
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
  }

  const helpOpen = Boolean(helpAnchorEl)
  return (
    <Grid container>
      <Grid item xs={6}>
        <TextField
          sx={{ mx: 3, mt: 3 }}
          required
          id="epochs"
          label="Epochs"
          type="number"
          value={localEpochs}
          disabled={training.trainingStatus || loadTraining}
          onChange={(event) => setLocalEpochs(event.target.value)}
          error={epochsError}
          helperText={epochsError ? 'Required!' : ' '}
          onMouseOver={(e) => {
            handleHelpPopperOpen(
              e,
              'This determines how long your model is trained. In each epoch, the entire dataset is passed through your net once.'
            )
          }}
          onMouseLeave={handleHelpPopperClose}
        />
        <TextField
          sx={{ mx: 3, mt: 3 }}
          required
          id="batchsize"
          label="Batch Size"
          type="number"
          value={training.selectedBatchSize}
          disabled={training.trainingStatus || loadTraining}
          onChange={(event) =>
            training.setSelectedBatchSize(event.target.value)
          }
          error={batchSizeError}
          helperText={batchSizeError ? 'Required!' : ' '}
          onMouseOver={(e) => {
            handleHelpPopperOpen(
              e,
              "The batch size determines how often the net's parameters are adjusted. The smaller the batch size, the more often that's the case!"
            )
          }}
          onMouseLeave={handleHelpPopperClose}
        />
        <ModelDetailsCard
          selectedModel={training.selectedModel}
          hoverFunc={(e) => {
            handleHelpPopperOpen(
              e,
              'Here you can see basic informations about your model. Among them are your chosen values for the optimizer, the loss, and other model-specific data.'
            )
          }}
          leaveFunc={handleHelpPopperClose}
        />
        <DatasetDetailsCard
          selectedDataset={training.selectedDataset}
          selectedLabels={training.selectedLabels}
          hoverFunc={(e) => {
            handleHelpPopperOpen(
              e,
              'Here you can see basic information about your chosen dataset. Most importantly, its size, and which label you chose to train on!'
            )
          }}
          leaveFunc={handleHelpPopperClose}
        />
      </Grid>
      <Grid item xs={6}>
        <Box
          onMouseOver={(e) => {
            handleHelpPopperOpen(
              e,
              'This chart shows the progression of your model in training. On the x-axis, you can see for how many epochs your model has been trained. Take a look at the different functions: They tell you how good your model is in predicting data from the dataset. For loss: The lower, the better! For r-squared: The closer to 1, the better (and a negative value is very bad).'
            )
          }}
          onMouseLeave={handleHelpPopperClose}
        >
          <PrettyChart data={filterData(training.trainingData)} />
        </Box>
        <Grid container>
          <Grid item xs={8}>
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
                disabled={epochsError || loadTraining}
                sx={{ m: 2 }}
                onClick={handleAdditionalTraining}
              >
                Train additional {localEpochs} epochs
              </Button>
            )}
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              sx={{ m: 2 }}
              onClick={() => navigate('/molecules')}
            >
              Continue to Molecules
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={showFinishDialog} onClose={handleCloseFinishDialog}>
        <DialogTitle>{'Your training finished!'}</DialogTitle>
        <Typography
          display="flex"
          sx={{
            justifyContent: 'center',
            color: theme.palette.text.secondary,
            p: 2,
          }}
        >
          {"Your model's accuracy: " + training.finishedAccuracy + '%'}
        </Typography>

        <DialogActions>
          <Button onClick={handleCloseFinishDialog}>Close</Button>
          <Button
            onClick={() => {
              navigate('/molecules')
            }}
          >
            Continue to molecules
          </Button>
        </DialogActions>
      </Dialog>
      <SnackBarAlert
        open={openSnackError}
        onClose={() => setOpenSnackError(false)}
        severity="error"
        message="Someone is already training right now. Please try again later"
      />
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
