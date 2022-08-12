import axios from 'axios'

const defaultAddress = '127.0.0.1' // TODO: insert correct URL
const defaultPort = '5000'

let serverAddress = defaultAddress
let serverPort = defaultPort
let connected = false

const api = axios.create({ baseURL: `http://${serverAddress}:${serverPort}` })

let userID = ''

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

function updateBaseURL() {
  api.defaults.baseURL = `http://${serverAddress}:${serverPort}`
  heartbeat()
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
    updateBaseURL()
  },

  setServerPort(port) {
    serverPort = port
    updateBaseURL()
  },

  async getModelList() {
    return api.get(`/users/${userID}/models`).then((response) => {
      return response.data
    })
  },

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

  async getFittings() {
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

  async addModelConfig(config) {
    return api.patch(`/users/${userID}/models`, config).then((response) => {
      return response.data
    })
  },

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

  async login(username) {
    return api.post(`/users`, { username }).then((response) => {
      return response.data
    })
  },

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

  async logout() {
    return api.delete(`/users/${userID}`).then((response) => {
      userID = ''
      return response.data
    })
  },

  async analyzeMolecule() {
    return api.post(`/users/${userID}/analyze`).then((response) => {
      return response.data
    })
  },

  async trainModel(
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
