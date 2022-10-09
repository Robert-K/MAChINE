import React from 'react'
import { IconButton } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import HelpContext from '../../context/HelpContext'

/**
 * Button to toggle Help Mode
 * @returns {JSX.Element}
 */
export default function HelpModeButton() {
  const help = React.useContext(HelpContext)

  const changeHelpMode = (value) => {
    help.setHelpMode(value)
  }

  return (
    <IconButton
      className="help-mode-button"
      sx={{ color: 'white' }}
      aria-label="Toggle Help Mode"
      onClick={() => {
        changeHelpMode(!help.helpMode)
      }}
    >
      {help.helpMode ? <HelpIcon /> : <HelpOutlineOutlinedIcon />}
    </IconButton>
  )
}
