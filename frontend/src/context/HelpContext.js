import React from 'react'
const HelpContext = React.createContext({
  helpMode: false,
  setHelpMode: () => {},
})

export const HelpProvider = HelpContext.Provider
export default HelpContext
