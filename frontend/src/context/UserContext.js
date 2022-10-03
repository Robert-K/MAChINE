import React from 'react'
const UserContext = React.createContext({
  userName: '',
  adminMode: false,
  setAdminMode: () => {},
})

export const UserProvider = UserContext.Provider
export default UserContext
