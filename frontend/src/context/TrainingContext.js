import React from 'react'
import PropTypes from 'prop-types'
import api from '../api'

const TrainingContext = React.createContext({
  trainingStatus: true,
  setTrainingStatus: () => {},
  trainingStopped: false,
  setTrainingStopped: () => {},
  trainingFinished: false,
  setTrainingFinished: () => {},
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
  trainingData: {},
  resetContext: () => {},
  stopTraining: () => {},
})

export const TrainingProvider = ({ children }) => {
  const [trainingStatus, setTrainingStatus] = React.useState(true)
  const [trainingStopped, setTrainingStopped] = React.useState(false)
  const [trainingFinished, setTrainingFinished] = React.useState(false)
  const [selectedModel, setSelectedModel] = React.useState({})
  const [selectedDataset, setSelectedDataset] = React.useState({})
  const [selectedLabels, setSelectedLabels] = React.useState([])
  const [selectedEpochs, setSelectedEpochs] = React.useState(10)
  const [selectedBatchSize, setSelectedBatchSize] = React.useState(64)
  const [trainingData, dispatchTrainingData] = React.useReducer(
    updateTrainingData,
    {},
    initTrainingData
  )

  React.useEffect(() => {
    setTrainingStatus(false)
    api.registerSocketListener('started', () => {
      setTrainingStatus(true)
      setTrainingStopped(false)
      setTrainingFinished(false)
      dispatchTrainingData({ type: 'reset' })
    })
    api.registerSocketListener('update', (data) => {
      dispatchTrainingData({ type: 'update', payload: data })
    })
    api.registerSocketListener('done', () => {
      setTrainingStatus(false)
      setTrainingFinished(true)
    })
  }, [])

  function updateTrainingData(trainingData, action) {
    switch (action.type) {
      case 'update': {
        const currentData = { ...trainingData }
        Object.entries(action.payload).forEach(([dataName, value], index) => {
          currentData[dataName] =
            currentData[dataName] === undefined
              ? [value]
              : [...currentData[dataName], value]
        })
        return currentData
      }
      case 'reset':
        return initTrainingData()
      default:
        throw new Error()
    }
  }

  function initTrainingData() {
    return {}
  }

  function resetContext() {
    setTrainingStatus(false)
    setTrainingStopped(false)
    setTrainingFinished(false)
    setSelectedModel({})
    setSelectedDataset({})
    setSelectedLabels([])
    setSelectedEpochs(10)
    setSelectedBatchSize(64)
    dispatchTrainingData({ type: 'reset' })
  }

  function stopTraining() {
    api.stopTraining()
    setTrainingStopped(true)
    const trainedEpochs = trainingData.epoch
      ? trainingData.epoch.length * 1.0
      : 0.0
    setSelectedEpochs(trainedEpochs)
  }

  return (
    <TrainingContext.Provider
      value={{
        trainingStatus,
        setTrainingStatus,
        trainingStopped,
        setTrainingStopped,
        trainingFinished,
        setTrainingFinished,
        selectedModel,
        setSelectedModel,
        selectedDataset,
        setSelectedDataset,
        selectedLabels,
        setSelectedLabels,
        selectedEpochs,
        setSelectedEpochs,
        selectedBatchSize,
        setSelectedBatchSize,
        trainingData,
        resetContext,
        stopTraining,
      }}
    >
      {children}
    </TrainingContext.Provider>
  )
}

TrainingProvider.propTypes = {
  children: PropTypes.any,
}
export default TrainingContext