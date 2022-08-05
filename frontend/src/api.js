import axios from 'axios'
import userContext from './UserContext'
import React from 'react'

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

  async getModelList() {
    return api
      .get(`/users/${React.useContext(userContext).userName}/models`)
      .then((response) => {
        return response.data
      })
  },

  async getMoleculeList() {
    return api
      .get(`/users/${React.useContext(userContext).userName}/molecules`)
      .then((response) => {
        return response.data
      })
      .catch((e) => {
        console.log(e)
        return []
      })
  },

  async getFittings() {
    return api
      .get(`/users/${React.useContext(userContext).userName}/fittings`)
      .then((response) => {
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
    return api
      .patch(`/users/${React.useContext(userContext).userName}/models`, config)
      .then((response) => {
        return response.data
      })
  },

  async addMolecule(smiles, name) {
    return api
      .patch(`/users/${React.useContext(userContext).userName}/molecules`, {
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
  async logout() {
    return api
      .delete(`/users/${React.useContext(userContext).userName}`)
      .then((response) => {
        return response.data
      })
  },

  async analyzeMolecule() {
    return api
      .post(`/users/${React.useContext(userContext).userName}/analyze`)
      .then((response) => {
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
      .post(`/users/${React.useContext(userContext).userName}/train`, {
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
