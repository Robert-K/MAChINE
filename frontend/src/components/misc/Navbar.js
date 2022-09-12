import { AppBar, Box, IconButton, Toolbar } from '@mui/material'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import * as React from 'react'
import logo from '../../logo.svg'
import PropTypes from 'prop-types'
import ServerStatusButton from './ServerStatusButton'
import UserContext from '../../context/UserContext'
import TrainingContext from '../../context/TrainingContext'
import LogoutIcon from '@mui/icons-material/Logout'
import ProgressBar from '../training/ProgressBar'

const links = {
  home: {
    link: '/home',
    label: 'Home',
  },
  models: {
    link: '/models',
    label: 'Models',
  },
  molecules: {
    link: '/molecules',
    label: 'Molecules',
  },
  results: {
    link: '/results',
    label: 'Scoreboards',
  },
  training: {
    link: '/training',
    label: 'Training',
  },
}

export default function Navbar({ logoutFunction, darkModeButton }) {
  const locationName = useLocation().pathname
  const user = React.useContext(UserContext)
  const training = React.useContext(TrainingContext)
  const [hideTraining, setHideTraining] = React.useState(true)

  // Navigates the user to the start page on page reload
  const navigate = useNavigate()
  React.useEffect(() => {
    navigate('/')
  }, [])

  React.useEffect(() => {
    locationName === links.training.link ||
    training.trainingStatus ||
    training.trainingFinished
      ? setHideTraining(false)
      : setHideTraining(true)
  }, [locationName, training.trainingStatus, training.trainingFinished])

  return (
    <AppBar color="primary" position="sticky">
      <Toolbar>
        <img src={logo} height="30px" style={{ marginRight: 10 }} />
        {!(locationName !== '/' || user.userName) ? null : (
          <>
            {Object.entries(links).map(([key, value]) => (
              <React.Fragment key={key}>
                {key === 'training' && hideTraining ? null : (
                  <NavLink
                    to={value.link}
                    key={value.label}
                    style={({ isActive }) =>
                      isActive
                        ? { fontWeight: 600, paddingLeft: 10, paddingRight: 10 }
                        : { paddingLeft: 10, paddingRight: 10 }
                    }
                  >
                    {value.label}
                  </NavLink>
                )}
              </React.Fragment>
            ))}
            {!(
              training.trainingStatus ||
              (training.trainingFinished && !training.trainingStopped)
            ) ? null : (
              <>
                <Box sx={{ width: '10%', ml: 1 }}>
                  <ProgressBar />
                </Box>
              </>
            )}
          </>
        )}
        <Box sx={{ flexGrow: 1 }}></Box>
        {!user.userName ? null : (
          <>
            {user.userName}
            <NavLink
              key="logout"
              to="/"
              onClick={() => {
                logoutFunction()
                training.resetContext()
              }}
            >
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
