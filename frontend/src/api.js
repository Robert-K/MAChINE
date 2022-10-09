import axios from 'axios'
import io from 'socket.io-client'

// Localhost by default
const defaultAddress = '127.0.0.1'
const defaultPort = '5000'

let serverAddress = defaultAddress
let serverPort = defaultPort

// Create http API and socket instance
const api = axios.create({ baseURL: `http://${serverAddress}:${serverPort}` })
let socket = io(`ws://${serverAddress}:${serverPort}`, { timeout: 60000 })

let userID = ''

/**
 * Updates the base URL for axios & address for socketio.
 * Creates a new socket with the new address and transfers all callbacks.
 */
function updateBaseURL() {
  api.defaults.baseURL = `http://${serverAddress}:${serverPort}`
  const newSocket = io(`ws://${serverAddress}:${serverPort}`, {
    timeout: 60000,
  })
  Object.keys(socket._callbacks).forEach((key) => {
    const eventName = key.replace('$', '')
    socket.listeners(eventName).forEach((func) => {
      newSocket.on(eventName, func)
    })
  })
  socket.disconnect()
  socket = newSocket
}

// Accessible frontend API functions
export default {
  /**
   * @returns {boolean} Status of the socket connection
   */
  getConnectionStatus() {
    return socket.connected
  },

  /**
   * @returns {string} Current server IP address
   */
  getServerAddress() {
    return serverAddress
  },

  /**
   * @returns {string} Current server port
   */
  getServerPort() {
    return serverPort
  },

  /**
   * @returns {string} Default server IP address
   */
  getDefaultAddress() {
    return defaultAddress
  },

  /**
   * @returns {string} Default server port
   */
  getDefaultPort() {
    return defaultPort
  },

  /**
   * Sets the server IP address and reconnects socket & axios
   * @param address {string} New server IP address
   */
  setServerAddress(address) {
    serverAddress = address
    updateBaseURL()
  },

  /**
   * Sets the server port and reconnects socket & axios
   * @param port {string} New server port
   */
  setServerPort(port) {
    serverPort = port
    updateBaseURL()
  },

  /**
   * Requests scoreboard data from backend
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the scoreboard list (response data) without exception handling
   */
  async getScoreboardSummaries() {
    return api.get('/scoreboard').then((response) => {
      return response.data
    })
  },

  /**
   * Request the deletion of a specific scoreboard entry
   * @param fittingID {string} ID of the fitting to be deleted
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the server response without exception handling
   */
  async deleteScoreboardFitting(fittingID) {
    return api.delete(`/scoreboard/${fittingID}`).then((response) => {
      return response
    })
  },

  /**
   * Requests the deletion of all scoreboard entries
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the server response without exception handling
   */
  async deleteScoreboardFittings() {
    return api.delete('/scoreboard').then((response) => {
      return response
    })
  },

  /**
   * Requests the model list for the current user
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the model list without exception handling
   */
  async getModelList() {
    return api.get(`/users/${userID}/models`).then((response) => {
      return response.data
    })
  },

  /**
   * Requests the molecule list for the current user
   * @returns {Promise<AxiosResponse<any> | *[]>} Promise that returns the molecule list or an empty array when an exception occured
   */
  async getMoleculeList() {
    return api
      .get(`/users/${userID}/molecules`)
      .then((response) => {
        return response.data
      })
      .catch((e) => {
        console.log(e)
        return []
      })
  },

  /**
   * Requests the fitting list for the current user
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the fitting list without exception handling
   */
  async getFittings() {
    return api.get(`/users/${userID}/fittings`).then((response) => {
      return response.data
    })
  },

  /**
   * Requests the dataset summary list
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the dataset summary list without exception handling
   */
  async getDatasets() {
    return api.get(`/datasets`).then((response) => {
      return response.data
    })
  },

  /**
   * Requests histograms for a specific dataset
   * @param datasetID {string} ID of the dataset
   * @param labels {string[]} List of labels to be included in the histogram
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the histogram data without exception handling
   */
  async getHistograms(datasetID, labels) {
    return api.get(`/histograms/${datasetID}/${labels}`).then((response) => {
      return response.data
    })
  },

  /**
   * Requests list of base models from server
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the base model list without exception handling
   */
  async getBaseModels() {
    return api.get(`/baseModels`).then((response) => {
      return response.data
    })
  },

  /**
   * Requests to add a model for the current user
   * @param config {ModelConfig} Model configuration
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the server response without exception handling
   */
  async addModelConfig(config) {
    return api.patch(`/users/${userID}/models`, config).then((response) => {
      return response.data
    })
  },

  /**
   * Requests to add a molecule for the current user
   * @param smiles {string} SMILES string of the molecule
   * @param cml {string} CML string of the molecule
   * @param name {string} Name of the molecule
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the server response data (null) without exception handling
   */
  async addMolecule(smiles, cml, name) {
    return api
      .patch(`/users/${userID}/molecules`, {
        smiles,
        cml,
        name,
      })
      .then((response) => {
        return response.data
      })
  },

  /**
   * Requests a user login
   * @param username Name of the new user
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the userID (response data) without exception handling
   */
  async login(username) {
    return api.post(`/users`, { username }).then((response) => {
      return response.data
    })
  },

  /**
   * Executes a login request and sets the userID
   * @param username Name of the new user
   * @returns {Promise<boolean>} Promise that returns true if the login was successful
   */
  async completeLogin(username) {
    return this.login(username)
      .then((r) => {
        userID = r.userID
        return true
      })
      .catch((e) => {
        console.log(e)
        return false
      })
  },

  /**
   * Requests a user logout
   * Resets the userID
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the server response (null) without exception handling
   */
  async logout() {
    return api.delete(`/users/${userID}`).then((response) => {
      userID = ''
      return response.data
    })
  },

  /**
   * Requests server to analyze a molecule with a specific fitting
   * @param fittingID {string} ID of the fitting
   * @param smiles {string} SMILES string of the molecule
   * @returns {Promise<AxiosResponse<any>>} Promise that returns the analysis results {Object} without exception handling
   */
  async analyzeMolecule(fittingID, smiles) {
    return api
      .post(`/users/${userID}/analyze`, { fittingID, smiles })
      .then((response) => {
        return response.data
      })
  },

  /**
   * Train referenced model with given dataset on given labels for given epochs with given batch size
   * @param datasetID {string} ID of dataset to train on
   * @param modelID {string} ID of model to train
   * @param labels {string} List of labels to train on
   * @param epochs {number} Number of epochs to train for
   * @param batchSize {number} Batch size to train with
   * @returns {Promise<AxiosResponse<any>>} Promise of Tuple of Boolean indicating success and HTTP response code
   */
  async trainModel(datasetID, modelID, labels, epochs, batchSize) {
    return api
      .post(`/users/${userID}/train`, {
        datasetID,
        modelID,
        labels: JSON.stringify(labels),
        epochs,
        batchSize,
      })
      .then((response) => {
        return response.data
      })
  },

  /**
   * Continues the training of referenced fitting for the specified number of epochs
   * @param fittingID {string} ID of fitting to continue training
   * @param epochs {number} Number of epochs to train for
   * @returns {Promise<AxiosResponse<any>>} Promise returning a number indicating the number of epochs to be trained, 0 when failed
   */
  async continueTraining(fittingID, epochs) {
    return api
      .patch(`/users/${userID}/train`, { fittingID, epochs })
      .then((response) => {
        return response.data
      })
      .catch((response) => {
        return response.data
      })
  },

  /**
   * Stops the currently running training
   * @returns {Promise<AxiosResponse<any>>} Promise of tuple Boolean indicating success and HTTP response code
   */
  async stopTraining() {
    return api.delete(`users/${userID}/train`).then((response) => {
      return response.data
    })
  },

  /**
   * Registers a callback function to be called when the socket emits the given event.
   * @param action {string} The event name
   * @param onAction {function} The callback function
   * @returns {Socket<DefaultEventsMap, ListenEvents>} void
   */
  registerSocketListener(action, onAction) {
    return socket.on(action, (res) => {
      if (res[userID]) {
        onAction(res[userID])
      }
    })
  },
}
