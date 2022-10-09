export default {
  registerSocketListener(action, onAction) {
    return undefined
  },
  completeLogin() {
    return new Promise((resolve) => {
      resolve(true)
    })
  },
  getConnectionStatus() {
    return true
  },
}
