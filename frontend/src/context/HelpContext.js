import React from 'react'
const HelpContext = React.createContext({ helpMode: false })

export const HelpProvider = HelpContext.Provider
export default HelpContext
