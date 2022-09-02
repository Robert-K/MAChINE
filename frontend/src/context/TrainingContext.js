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
  selectedEpochs: 0,
  setSelectedEpochs: () => {},
  selectedBatchSize: 0,
  setSelectedBatchSize: () => {},
  progress: 0,
  setProgress: () => {},
})

export const TrainingProvider = TrainingContext.Provider
export default TrainingContext
