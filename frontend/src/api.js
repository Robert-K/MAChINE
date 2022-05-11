import axios from 'axios'

const serverAddress = 'http://127.0.0.1:5000' // TODO: insert correct URL

const api = axios.create({
  baseURL: serverAddress
})

export default {
  deleteUser (user) {
    return api.delete(serverAddress + '/user/delete', { data: { user } }).then((response) => {
      console.log(response.data)
    })
  },

  getUserScore (user) {
    return api.get(serverAddress + '/user/score', { data: { user } }).then((response) => {
      console.log(response.data)
    })
  },

  async getUserGreeting (user) {
    return api.post('/home/', { user }).then((response) => {
      // console.log(response.data)
      return response.data
    })
  }
}
