import React from 'react'
const UserContext = React.createContext({ userName: '', userID: '' })

export const UserProvider = UserContext.Provider
export default UserContext
