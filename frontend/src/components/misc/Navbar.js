import React from 'react'
import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ServerStatusButton from './ServerStatusButton'
import ProgressBar from '../training/ProgressBar'
import UserContext from '../../context/UserContext'
import TrainingContext from '../../context/TrainingContext'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../logo.svg'
import PropTypes from 'prop-types'

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

/**
 * Navigation and utility bar
 * @param logoutFunction callback for logout
 * @param darkModeButton button to toggle theme
 * @param helpModeButton button to toggle Help Mode
 * @returns {JSX.Element}
 */
export default function Navbar({
  logoutFunction,
  darkModeButton,
  helpModeButton,
}) {
  const locationName = useLocation().pathname
  const user = React.useContext(UserContext)
  const training = React.useContext(TrainingContext)
  const [hideTraining, setHideTraining] = React.useState(true)
  const navigate = useNavigate()

  // Navigates the user to the start page on page reload
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
        <img
          src={logo}
          alt="MAChINE"
          height="30px"
          style={{
            marginRight: 10,
            animation: training.trainingStatus
              ? 'spin 2s linear infinite'
              : 'none',
          }}
        />
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
                        ? {
                            fontWeight: 600,
                            paddingLeft: 10,
                            paddingRight: 10,
                          }
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
                <Box sx={{ width: '10%', mx: 1 }}>
                  <ProgressBar />
                </Box>
                {training.trainingStatus ? null : <CheckCircleIcon />}
              </>
            )}
          </>
        )}
        <Box sx={{ flexGrow: 1 }}></Box>
        {user.adminMode ? (
          <Button
            sx={{ mr: 2 }}
            variant="contained"
            size="large"
            onClick={() => {
              user.setAdminMode(false)
            }}
            endIcon={<AdminPanelSettingsIcon />}
          >
            Exit Admin Mode
          </Button>
        ) : null}

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
        {helpModeButton}
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
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </AppBar>
  )
}

Navbar.propTypes = {
  logoutFunction: PropTypes.func.isRequired,
  darkModeButton: PropTypes.element,
  helpModeButton: PropTypes.element,
}
