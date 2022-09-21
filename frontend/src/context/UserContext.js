import React from 'react'
const UserContext = React.createContext({ userName: '' })

export const UserProvider = UserContext.Provider
export default UserContext
