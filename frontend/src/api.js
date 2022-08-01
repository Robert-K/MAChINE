import axios from 'axios'

const defaultAddress = '127.0.0.1' // TODO: insert correct URL
const defaultPort = '5000'

let serverAddress = defaultAddress
let serverPort = defaultPort

//
const api = axios.create({ baseURL: `http://${serverAddress}:${serverPort}` })

let connected = false

setInterval(() => {
  heartbeat()
}, 10000)

function heartbeat() {
  api
    .get(`/check`)
    .then((response) => {
      connected = response.status === 200
    })
    .catch(() => {
      connected = false
    })
}

export default {
  getConnectionStatus() {
    return connected
  },

  getServerAddress() {
    return serverAddress
  },

  getServerPort() {
    return serverPort
  },

  getDefaultAddress() {
    return defaultAddress
  },

  getDefaultPort() {
    return defaultPort
  },

  setServerAddress(address) {
    serverAddress = address
    this.__updateBaseURL()
  },

  setServerPort(port) {
    serverPort = port
    this.__updateBaseURL()
  },

  __updateBaseURL() {
    api.defaults.baseURL = `http://${serverAddress}:${serverPort}`
  },

  async getModelList(userID) {
    return api.get(`/users/${userID}/models`).then((response) => {
      return response.data
    })
  },

  async getMoleculeList(userID) {
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

  async getFittings(userID) {
    return api.get(`/users/${userID}/fittings`).then((response) => {
      return response.data
    })
  },

  async getDatasets() {
    return api.get(`/datasets`).then((response) => {
      return response.data
    })
  },

  async getBaseModels() {
    return api.get(`/baseModels`).then((response) => {
      return response.data
    })
  },

  async addModelConfig(userID, config) {
    return api.patch(`/users/${userID}/models`, config).then((response) => {
      return response.data
    })
  },

  async addMolecule(userID, smiles, name) {
    return api
      .patch(`/users/${userID}/molecules`, {
        smiles,
        name,
      })
      .then((response) => {
        return response.data
      })
  },

  async login(username) {
    return api.post(`/users`, { username }).then((response) => {
      return response.data
    })
  },
  async logout(userID) {
    return api.delete(`/users/${userID}`).then((response) => {
      return response.data
    })
  },

  async analyzeMolecule(userID) {
    return api.post(`/users/${userID}/analyze`).then((response) => {
      return response.data
    })
  },

  async trainModel(
    userID,
    datasetID,
    modelID,
    fingerprint,
    label,
    epochs,
    accuracy,
    batchSize
  ) {
    return api
      .post(`/users/${userID}/train`, {
        datasetID,
        modelID,
        fingerprint,
        label,
        epochs,
        accuracy,
        batchSize,
      })
      .then((response) => {
        return response.data
      })
  },
}
