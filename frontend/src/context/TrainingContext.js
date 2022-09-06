import React from 'react'
import PropTypes from 'prop-types'
import api from '../api'

const TrainingContext = React.createContext({
  trainingStatus: true,
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
  trainingData: {},
})

export const TrainingProvider = ({ children }) => {
  const [trainingStatus, setTrainingStatus] = React.useState(true)
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
      dispatchTrainingData({ type: 'reset' })
    })
    api.registerSocketListener('update', (data) => {
      dispatchTrainingData({ type: 'update', payload: data })
    })
    api.registerSocketListener('done', () => {
      setTrainingStatus(false)
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

  return (
    <TrainingContext.Provider
      value={{
        trainingStatus,
        setTrainingStatus,
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
