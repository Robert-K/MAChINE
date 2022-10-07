import React from 'react'
import { LinearProgress } from '@mui/material'
import TrainingContext from '../../context/TrainingContext'

/**
 * a simple linear progress bar showing the progress of the training by the done epochs
 * @returns {JSX.Element} a thin horizontal object showing just a progress bar
 * @constructor
 */
export default function ProgressBar() {
  // epochs count get provided by the TrainingContext
  const { selectedEpochs, trainingData } = React.useContext(TrainingContext)
  // + 1 Because the epochs are counted up from 0, but we want the total amount of epochs
  const trainedEpochs = trainingData.Epoch
    ? (trainingData.Epoch[trainingData.Epoch.length - 1] + 1) * 1.0
    : 0.0
  // Epoch has to be written exactly like its excluded on TrainingPage, which in this case is 'Epoch'
  const progress = (trainedEpochs / selectedEpochs) * 100.0
  return (
    <LinearProgress variant="determinate" color="inherit" value={progress} />
  )
}
