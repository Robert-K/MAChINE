import { AppBar, Box, Toolbar } from '@mui/material'
import { NavLink } from 'react-router-dom'
import React from 'react'
import logo from '../logo.svg'
import PropTypes from 'prop-types'
import DarkModeButton from './DarkModeButton'

export default function Navbar(props) {
  return (
    <AppBar color="primary" position="sticky">
      <Toolbar>
        <img src={logo} height="30px" mx="2" />
        <NavLink to="/">Home</NavLink>
        <NavLink to="/models">Models</NavLink>
        <NavLink to="/molecules">Molecules</NavLink>
        <NavLink to="/results">Scoreboards</NavLink>
        <Box sx={{ flexGrow: 1 }}></Box>
        <DarkModeButton />
        {!props.userName ? null : (
          <NavLink key="logout" to="/" onClick={() => props.logoutFunction()}>
            Not {props.userName}? Log out
          </NavLink>
        )}
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

Navbar.propTypes = {
  userName: PropTypes.string.isRequired,
  logoutFunction: PropTypes.func.isRequired,
}
