import React from 'react'
import { IconButton } from '@mui/material'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import HelpContext from '../../context/HelpContext'

export default function HelpModeButton() {
  const help = React.useContext(HelpContext)

  const changeHelpMode = (value) => {
    help.setHelpMode(value)
  }

  return (
    <IconButton
      sx={{ color: help.helpMode ? 'white' : 'black' }}
      aria-label="Toggle Help Mode"
      onClick={() => {
        changeHelpMode(!help.helpMode)
      }}
    >
      <HelpOutlineOutlinedIcon />
    </IconButton>
  )
}
