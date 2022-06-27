import { AppBar, Toolbar } from '@mui/material'
import { NavLink } from 'react-router-dom'
import React from 'react'
import logo from '../logo.svg'

export default function Navbar() {
  return (
    <AppBar color="primary" position="sticky">
      <Toolbar>
        <img src={logo} height="30px" mx="2" />
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/models">Models</NavLink>
        <NavLink to="/molecules">Molecules</NavLink>
        <NavLink to="/results">Scoreboards</NavLink>
      </Toolbar>
      <style jsx>{`
        a {
          color: white;
          text-decoration: none;
          padding-left: 10px;
        }
        a.active {
          font-weight: bold;
        }
      `}</style>
    </AppBar>
  )
}
