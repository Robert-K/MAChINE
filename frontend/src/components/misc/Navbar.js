import { AppBar, Box, IconButton, LinearProgress, Toolbar } from '@mui/material'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import * as React from 'react'
import logo from '../../logo.svg'
import PropTypes from 'prop-types'
import ServerStatusButton from './ServerStatusButton'
import UserContext from '../../context/UserContext'
import TrainingContext from '../../context/TrainingContext'
import LogoutIcon from '@mui/icons-material/Logout'

const links = [
  { link: '/home', label: 'Home' },
  { link: '/models', label: 'Models' },
  { link: '/molecules', label: 'Molecules' },
  { link: '/results', label: 'Scoreboards' },
  { link: '/charts', label: 'Charts Test' },
]

export default function Navbar({ logoutFunction, darkModeButton }) {
  const locationName = useLocation().pathname
  const user = React.useContext(UserContext)
  const training = React.useContext(TrainingContext)
  const [progress, setProgress] = React.useState(0)

  // Navigates the user to the start page on page reload
  const navigate = useNavigate()
  React.useEffect(() => {
    navigate('/')
  }, [])

  // TODO: Replace this dummy data with the actual training progress
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 500)

    return () => {
      clearInterval(timer)
    }
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
        {!(
          (locationName === '/training' || training.trainingStatus) &&
          user.userName
        ) ? null : (
          <>
            <NavLink
              to={'/training'}
              key={'Training'}
              style={({ isActive }) =>
                isActive
                  ? { fontWeight: 600, paddingLeft: 10, paddingRight: 10 }
                  : { paddingLeft: 10, paddingRight: 10 }
              }
            >
              Training
            </NavLink>
            {!training.trainingStatus ? null : (
              <Box sx={{ width: '10%', ml: 1 }}>
                <LinearProgress
                  variant="determinate"
                  color="inherit"
                  value={progress}
                />
              </Box>
            )}
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
