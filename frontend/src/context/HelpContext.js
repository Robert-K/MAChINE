import React from 'react'

/**
 * provides information about the helpMode being active
 * @type {React.Context<{setHelpMode: setHelpMode, helpMode: boolean}>}
 */
const HelpContext = React.createContext({
  helpMode: false,
  setHelpMode: () => {},
})

export const HelpProvider = HelpContext.Provider
export default HelpContext
