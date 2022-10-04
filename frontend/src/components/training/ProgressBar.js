import React from 'react'
import { LinearProgress } from '@mui/material'
import TrainingContext from '../../context/TrainingContext'

export default function ProgressBar() {
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
