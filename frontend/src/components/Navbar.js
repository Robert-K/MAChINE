import { AppBar, Link, Toolbar } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import React from 'react'

export default function Navbar() {
  return (
    <AppBar color="primary">
      <Toolbar>
        <Link
          component={RouterLink}
          to="/home"
          color="inherit"
          underline="none"
          paddingRight="10px"
        >
          Home
        </Link>
        <Link
          component={RouterLink}
          to="/models"
          color="inherit"
          underline="none"
          paddingRight="10px"
        >
          Models
        </Link>
        <Link
          component={RouterLink}
          to="/molecules"
          color="inherit"
          underline="none"
          paddingRight="10px"
        >
          Molecules
        </Link>
        <Link
          component={RouterLink}
          to="/results"
          color="inherit"
          underline="none"
        >
          Scoreboards
        </Link>
      </Toolbar>
    </AppBar>
  )
}
