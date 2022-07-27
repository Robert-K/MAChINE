import axios from 'axios'

const serverAddress = 'http://127.0.0.1:5000' // TODO: insert correct URL

const api = axios.create({
  baseURL: serverAddress,
})

export default {
  deleteUser(userID) {
    return api
      .delete(`${serverAddress}/users/${userID}/delete`)
      .then((response) => {
        console.log(response.data)
      })
  },

  async getModelList(userID) {
    return api
      .get(`${serverAddress}/users/${userID}/models`)
      .then((response) => {
        return response.data
      })
  },

  async getMoleculeList(userID) {
    return api
      .get(`${serverAddress}/users/${userID}/molecules`)
      .then((response) => {
        return response.data
      })
  },

  async getFittings(userID) {
    return api
      .get(`${serverAddress}/users/${userID}/fittings`)
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

  async addModelConfig(userID, config) {
    return api
      .patch(`${serverAddress}/users/${userID}/models`, config)
      .then((response) => {
        return response.data
      })
  },

  async addMolecule(userID, molecule) {
    return api
      .patch(`${serverAddress}/users/${userID}/molecules`, molecule)
      .then((response) => {
        return response.data
      })
  },

  async login(username) {
    return api.post(`${serverAddress}/users/${username}`).then((response) => {
      return response.data
    })
  },
  async logout(userID) {
    return api.delete(`${serverAddress}/users/${userID}/`).then((response) => {
      return response.data
    })
  },

  async analyzeMolecule(userID, moleculeID, fittingID) {
    return api
      .post(`${serverAddress}/users/${userID}/analyze`, {
        moleculeID,
        fittingID,
      })
      .then((response) => {
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
      .post(`${serverAddress}/users/${userID}/train`, {
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
  /*
  TODO: to be implemented here
   * get MoleculeList
   * get ModelList
   * get TrainedModels / get Fittings
   * get Datasets
   * get BaseModels
   * patch addModelConfig
   * patch addMolecule
   * post login
   * del logout
   * post analyzeMolecule
   * post trainModel
   */
}
