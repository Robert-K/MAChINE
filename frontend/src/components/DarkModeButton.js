import { IconButton } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import React from 'react'

export default function DarkModeButton(props) {
  const [darkMode, setDarkMode] = React.useState(false)

  return (
    <IconButton
      sx={{ color: 'white' }}
      aria-label="Toggle Dark Mode"
      onClick={() => {
        setDarkMode(!darkMode)
      }}
    >
      {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  )
}
