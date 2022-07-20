import axios from 'axios'

const serverAddress = 'http://127.0.0.1:5000' // TODO: insert correct URL

const api = axios.create({
  baseURL: serverAddress,
})

export default {
  deleteUser(user) {
    return api
      .delete(serverAddress + '/user/delete', { data: { user } })
      .then((response) => {
        console.log(response.data)
      })
  },

  setUserScore(user, score) {
    return api
      .post('/users/' + user + '/score/', { score })
      .then((response) => {
        console.log(response.data)
      })
  },

  // TODO: remove this test method
  async getUserScore(user) {
    return api.get('/users/' + user + '/score/').then((response) => {
      console.log(response.data)
      return response.data
    })
  },

  // TODO: remove this test method
  async getUserGreeting(user) {
    return api.get('/users/' + user + '/greeting/').then((response) => {
      console.log(response.data)
      return response.data
    })
  },

  async getModelInfo() {
    return api.get('/get/models').then((response) => {
      return response.data
    })
  },

  async getMoleculeInfo() {
    return api.get('/get/molecules').then((response) => {
      return response.data
    })
  },

  /*
  TODO: to be implemented here
   * get MoleculeList
   * get ModelList
   * get TrainedModels
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
