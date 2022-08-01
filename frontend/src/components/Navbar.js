import { AppBar, Box, Toolbar } from '@mui/material'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import * as React from 'react'
import logo from '../logo.svg'
import PropTypes from 'prop-types'
import ServerStatusButton from './ServerStatusButton'
import UserContext from '../UserContext'

export default function Navbar(props) {
  const locationName = useLocation().pathname
  const user = React.useContext(UserContext)

  // Navigates the user to the start page on page reload
  const navigate = useNavigate()
  React.useEffect(() => {
    navigate('/')
  }, [])

  return (
    <AppBar color="primary" position="sticky">
      <Toolbar>
        <img src={logo} height="30px" mx="2" />
        {!(locationName !== '/' || user.userName) ? null : (
          <>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/models">Models</NavLink>
            <NavLink to="/molecules">Molecules</NavLink>
            <NavLink to="/results">Scoreboards</NavLink>
          </>
        )}

        <Box sx={{ flexGrow: 1 }}></Box>
        {!user.userName ? null : (
          <NavLink key="logout" to="/" onClick={() => props.logoutFunction()}>
            Not {user.userName}? <u>Log out</u>
          </NavLink>
        )}
        <ServerStatusButton />

        {props.darkModeButton}
      </Toolbar>
      <style jsx="true">{`
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
  logoutFunction: PropTypes.func.isRequired,
  darkModeButton: PropTypes.element,
}
