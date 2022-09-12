import React from 'react'
import { LinearProgress } from '@mui/material'
import TrainingContext from '../../context/TrainingContext'

export default function ProgressBar() {
  const { selectedEpochs, trainingData } = React.useContext(TrainingContext)
  const trainedEpochs = trainingData.epoch
    ? trainingData.epoch.length * 1.0
    : 0.0
  return (
    <LinearProgress
      variant="determinate"
      color="inherit"
      value={(trainedEpochs / selectedEpochs) * 100.0}
    />
  )
}
