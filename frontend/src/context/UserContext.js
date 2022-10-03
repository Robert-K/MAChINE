import React from 'react'
const UserContext = React.createContext({
  userName: '',
  adminMode: false,
  setAdminActive: () => {},
})

export const UserProvider = UserContext.Provider
export default UserContext
