import { AppBar, Box, IconButton, Toolbar } from '@mui/material'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import * as React from 'react'
import logo from '../../logo.svg'
import PropTypes from 'prop-types'
import ServerStatusButton from './ServerStatusButton'
import UserContext from '../../UserContext'
import LogoutIcon from '@mui/icons-material/Logout'

const links = [
  { link: '/home', label: 'Home' },
  { link: '/models', label: 'Models' },
  { link: '/molecules', label: 'Molecules' },
  { link: '/results', label: 'Scoreboards' },
  { link: '/socket', label: 'Socket Test' },
]

export default function Navbar({ logoutFunction, darkModeButton }) {
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
        <img src={logo} height="30px" style={{ marginRight: 10 }} />
        {!(locationName !== '/' || user.userName) ? null : (
          <>
            {links.map(({ link, label }) => (
              <NavLink
                to={link}
                key={label}
                style={({ isActive }) =>
                  isActive
                    ? { fontWeight: 600, paddingLeft: 10, paddingRight: 10 }
                    : { paddingLeft: 10, paddingRight: 10 }
                }
              >
                {label}
              </NavLink>
            ))}
          </>
        )}

        <Box sx={{ flexGrow: 1 }}></Box>
        {!user.userName ? null : (
          <>
            {user.userName}
            <NavLink key="logout" to="/" onClick={() => logoutFunction()}>
              <IconButton sx={{ color: 'white' }}>
                <LogoutIcon />
              </IconButton>
            </NavLink>
          </>
        )}

        <ServerStatusButton />

        {darkModeButton}
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
