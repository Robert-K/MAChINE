import React from 'react'

/**
 * UserContext holds information related to the current user
 * @type {React.Context<{adminMode: boolean, setAdminMode: setAdminMode, userName: string}>}
 */
const UserContext = React.createContext({
  userName: '',
  adminMode: false,
  setAdminMode: () => {},
})

export const UserProvider = UserContext.Provider
export default UserContext
