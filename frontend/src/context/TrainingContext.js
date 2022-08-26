import React from 'react'

const TrainingContext = React.createContext({
  trainingStatus: false,
  setTrainingStatus: () => {},
  selectedModel: null,
  setSelectedModel: () => {},
  selectedDataset: null,
  setSelectedDataset: () => {},
  selectedLabels: [],
  setSelectedLabels: () => {},
})

export const TrainingProvider = TrainingContext.Provider
export default TrainingContext
