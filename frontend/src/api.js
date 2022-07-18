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

  async createNewModelConfig(config) {
    return api.get('/models/add', config).then((response) => {
      return response.data
    })
  },
  /*


  setUserScore(user, score) {
    return api
      .post('/users/' + user + '/score/', { score })
      .then((response) => {
        console.log(response.data)
      })
  },

  async getUserScore(user) {
    return api.get('/users/' + user + '/score/').then((response) => {
      console.log(response.data)
      return response.data
    })
  },

  async getUserGreeting(user) {
    return api.get('/users/' + user + '/greeting/').then((response) => {
      console.log(response.data)
      return response.data
    })
  },
*/
}
