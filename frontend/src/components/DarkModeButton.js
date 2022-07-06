import { IconButton } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import React from 'react'
import PropTypes from 'prop-types'

export default function DarkModeButton({ setModeFunction }) {
  const [darkMode, setDarkMode] = React.useState(false)

  const changeDarkMode = (value) => {
    setDarkMode(value)
    setModeFunction(value)
  }

  return (
    <IconButton
      sx={{ color: 'white' }}
      aria-label="Toggle Dark Mode"
      onClick={() => {
        changeDarkMode(!darkMode)
      }}
    >
      {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  )
}

DarkModeButton.propTypes = {
  setModeFunction: PropTypes.func,
}
