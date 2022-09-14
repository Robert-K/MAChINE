import React from 'react'
import { IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'

export default function HelpModeButton({ initialHelpMode, setModeFunction }) {
  const [helpMode, setHelpMode] = React.useState(initialHelpMode)

  const changeHelpMode = (value) => {
    setHelpMode(value)
  }

  return (
    <IconButton
      sx={{ color: helpMode ? 'black' : 'white' }}
      aria-label="Toggle Help Mode"
      onClick={() => {
        changeHelpMode(!helpMode)
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
