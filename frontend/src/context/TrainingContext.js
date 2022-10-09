import React from 'react'
import api from '../api'
import PropTypes from 'prop-types'
import { camelToNaturalString } from '../utils'

/**
 * Provides information about the currently running training.
 * @property {boolean} trainingStatus True while training is running.
 * @property {function} setTrainingStatus Sets the training status.
 * @property {boolean} trainingStopped True when training was stopped manually.
 * @property {boolean} trainingFinished True when training is over (including on manual stop).
 * @property {string} trainingID Set after first training is finished. On training start set to '0'.
 * @property {ModelConfig} selectedModel Selected Model for the training process.
 * @property {function} setSelectedModel Sets the selected model.
 * @property {Dataset} selectedDataset Selected Dataset for the training process.
 * @property {function} setSelectedDataset Sets the selected Dataset.
 * @property {Array} selectedLabels Selection of labels from the dataset. Model is trained on these.
 * @property {function} setSelectedLabels Sets the selection of labels.
 * @property {number} selectedEpochs How many Epochs the model should train for.
 * @property {function} setSelectedEpochs Sets the selected Epochs.
 * @property {number} selectedBatchSize Batch size for training.
 * @property {function} setSelectedBatchSize Sets the batch size for training.
 * @property {object} trainingData Data received over the course of the training process. Contains arrays for data from metrics.
 * @property {function} softResetContext "Soft resets" the context. Keeps Labels, Model, Dataset, Epochs, Batch Size.
 * @property {function} resetContext Sets every value in context back to their default values
 * @property {function} stopTraining Stops a running training
 * @property {number} finishedAccuracy Evaluated accuracy provided by backend on training finished
 * @property {function} selectExampleTrainingParameters Sets parameters so the training page works for the tutorial
 * @type {React.Context<{trainingID: string, trainingStatus: boolean, selectedDataset: null, trainingData: {}, setSelectedDataset: setSelectedDataset, setSelectedModel: setSelectedModel, resetContext: resetContext, trainingStopped: boolean, trainingFinished: boolean, setSelectedLabels: setSelectedLabels, selectedEpochs: number, softResetContext: softResetContext, finishedAccuracy: number, setTrainingFinished: setTrainingFinished, setSelectedBatchSize: setSelectedBatchSize, selectExampleTrainingParameters: selectExampleTrainingParameters, selectedLabels: *[], selectedBatchSize: number, stopTraining: stopTraining, setSelectedEpochs: setSelectedEpochs, selectedModel: null}>}
 */
const TrainingContext = React.createContext({
  trainingStatus: true,
  trainingStopped: false,
  trainingFinished: false,
  setTrainingFinished: () => {},
  trainingID: '0',
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

/**
 * TrainingContext.Provider
 * Contains all the states and values used in the context
 * @param children
 * @returns {JSX.Element}
 */
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

  /**
   * Registers socket listeners for potential training updates/starts/finishes
   */
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
      setTrainingFinished(true)
      setTrainingID(response.fittingID)
      setSelectedEpochs(response.epochs)
      setFinishedAccuracy(response.accuracy)
    })
  }, [])

  /**
   * Sets Dataset and Model to first dataset and model available
   */
  function selectExampleTrainingParameters() {
    api.getModelList().then((response) => {
      setSelectedModel(response[0])
    })
    api.getDatasets().then((response) => {
      setSelectedDataset(response[0])
      setSelectedLabels([response[0].labelDescriptors[0]])
    })
  }

  /**
   * Updates trainingData with data for a new epoch
   * @param trainingData Current trainingData
   * @param action Action to take, "update", "reset"
   * @returns [trainingData with appended Epoch Data | nothing]
   */
  function updateTrainingData(trainingData, action) {
    switch (action.type) {
      case 'update': {
        const currentData = { ...trainingData }
        Object.entries(action.payload).forEach(([dataName, value]) => {
          dataName = camelToNaturalString(dataName)
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
        trainingStopped,
        trainingFinished,
        setTrainingFinished,
        trainingID,
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
