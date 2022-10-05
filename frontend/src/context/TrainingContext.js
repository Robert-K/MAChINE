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
  trainingID: '0',
  setTrainingID: () => {},
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
  softResetContext: () => {},
  resetContext: () => {},
  stopTraining: () => {},
  finishedAccuracy: 0,
  selectExampleTrainingParameters: () => {},
})

export const TrainingProvider = ({ children }) => {
  const [trainingStatus, setTrainingStatus] = React.useState(true)
  const [trainingStopped, setTrainingStopped] = React.useState(false)
  const [trainingFinished, setTrainingFinished] = React.useState(false)
  const [trainingID, setTrainingID] = React.useState('0')
  const [selectedModel, setSelectedModel] = React.useState(undefined)
  const [selectedDataset, setSelectedDataset] = React.useState(undefined)
  const [selectedLabels, setSelectedLabels] = React.useState([])
  const [selectedEpochs, setSelectedEpochs] = React.useState(10)
  const [selectedBatchSize, setSelectedBatchSize] = React.useState(64)
  const [finishedAccuracy, setFinishedAccuracy] = React.useState(0)
  const [trainingData, dispatchTrainingData] = React.useReducer(
    updateTrainingData,
    {},
    initTrainingData
  )

  React.useEffect(() => {
    setTrainingStatus(false)
    api.registerSocketListener('started', (data) => {
      setTrainingStatus(true)
      setTrainingStopped(false)
      setTrainingFinished(false)
      setSelectedEpochs(data)
    })
    api.registerSocketListener('update', (data) => {
      dispatchTrainingData({ type: 'update', payload: data })
    })
    api.registerSocketListener('done', (response) => {
      setTrainingStatus(false)
      if (selectedLabels.length !== 0) {
        setTrainingFinished(true)
        setTrainingID(response.fittingID)
        setSelectedEpochs(response.epochs)
        setFinishedAccuracy(response.accuracy)
      }
    })
  }, [])

  function selectExampleTrainingParameters() {
    api.getModelList().then((response) => {
      setSelectedModel(response[0])
    })
    api.getDatasets().then((response) => {
      setSelectedDataset(response[0])
      setSelectedLabels([response[0].labelDescriptors[0]])
    })
  }

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

  function softResetContext() {
    setTrainingStatus(false)
    setTrainingStopped(false)
    setTrainingFinished(false)
    setTrainingID('0')
    dispatchTrainingData({ type: 'reset' })
  }

  function resetContext() {
    softResetContext()
    setSelectedModel({})
    setSelectedDataset({})
    setSelectedLabels([])
    setSelectedEpochs(10)
    setSelectedBatchSize(64)
  }

  function stopTraining() {
    api.stopTraining()
    setTrainingStopped(true)
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
        trainingID,
        setTrainingID,
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
        softResetContext,
        resetContext,
        stopTraining,
        finishedAccuracy,
        selectExampleTrainingParameters,
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
