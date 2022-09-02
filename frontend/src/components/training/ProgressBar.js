import { LinearProgress } from '@mui/material'
import * as React from 'react'
import TrainingContext from '../../context/TrainingContext'

export default function ProgressBar() {
  const training = React.useContext(TrainingContext)
  return (
    <LinearProgress
      variant="determinate"
      color="inherit"
      value={training.progress}
    />
  )
}
