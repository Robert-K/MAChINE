import React from 'react'
import { useLocation } from 'react-router-dom'

export default function TrainingPage() {
  const { state } = useLocation()
  const { selectedModel, selectedDatasetID, selectedLabels } = state
  console.log(selectedModel, selectedDatasetID, selectedLabels)
  return <div>This is the Page for Training</div>
}
