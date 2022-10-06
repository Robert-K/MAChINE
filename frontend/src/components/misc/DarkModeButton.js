import { IconButton } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import React from 'react'
import PropTypes from 'prop-types'

/**
 * Button to toggle theme
 * @param initialDarkMode initial theme
 * @param setModeFunction callback to propagate theme switches
 * @returns {JSX.Element}
 */
export default function DarkModeButton({ initialDarkMode, setModeFunction }) {
  const [darkMode, setDarkMode] = React.useState(initialDarkMode)

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
  initialDarkMode: PropTypes.bool,
  setModeFunction: PropTypes.func,
}
