import React from 'react'
import { LinearProgress } from '@mui/material'
import TrainingContext from '../../context/TrainingContext'

export default function ProgressBar() {
  const { selectedEpochs, trainingData } = React.useContext(TrainingContext)
  // + 1 Because the epochs are counted up from 0, but we want the total amount of epochs
  const trainedEpochs = trainingData.epoch
    ? (trainingData.epoch[trainingData.epoch.length - 1] + 1) * 1.0
    : 0.0
  const progress = (trainedEpochs / selectedEpochs) * 100.0
  return (
    <LinearProgress variant="determinate" color="inherit" value={progress} />
  )
}
