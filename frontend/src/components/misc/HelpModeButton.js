import React from 'react'
import { IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import HelpContext from '../../context/HelpContext'

export default function HelpModeButton({ initialHelpMode, setModeFunction }) {
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
        console.log('Inside button: ')
        console.log(help.helpMode)
      }}
    >
      {<HelpOutlineOutlinedIcon />}
    </IconButton>
  )
}

HelpModeButton.propTypes = {
  initialHelpMode: PropTypes.bool,
  setModeFunction: PropTypes.func,
}
