import React, { useEffect } from 'react'
import { useTheme } from '@mui/material'
import UserContext from './context/UserContext'
import Joyride, { ACTIONS, EVENTS } from 'react-joyride'
import OnboardingTooltip from './components/onboarding/OnboardingTooltip'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Onboarding({ run, callback }) {
  const user = React.useContext(UserContext)
  const theme = useTheme()
  const navigate = useNavigate()
  const locationName = useLocation().pathname
  const [stepIndex, setStepIndex] = React.useState(0)

  useEffect(() => {
    if (!run) {
      setStepIndex(0)
    }
  }, [run])

  const internalCallback = (data) => {
    const { action, index, status, type } = data
    if (EVENTS.STEP_BEFORE === type) {
      if (
        steps[index].skipLocations &&
        steps[index].skipLocations.includes(locationName)
      ) {
        setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
      }
      if (steps[index].location) {
        navigate(steps[stepIndex].location)
      }
    }
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
    }
    callback(data)
  }

  const steps = [
    {
      content: (
        <div>
          <h2>
            Hi {user.userName}! Welcome to{' '}
            <span style={{ color: theme.palette.primary.main }}>MAChINE</span>!
          </h2>
          Would you like to take a quick tour of the app?
          <br />
          Sike! There&apos;s no exit button. You&apos;re stuck here now.
        </div>
      ),
      placement: 'center',
      target: 'body',
      location: '/home',
    },
    {
      content: (
        <div>
          <h2>
            This is the{' '}
            <span style={{ color: theme.palette.primary.main }}>Navbar</span>
          </h2>
          This is where you can navigate to different pages in the app.
          <br />
          It also allows you to log out and switch between light and dark mode.
        </div>
      ),
      spotlightPadding: 0,
      spotlightClicks: true,
      target: '.MuiToolbar-root',
    },
    {
      content: (
        <div>
          <h2>
            Let&apos;s go to the{' '}
            <span style={{ color: theme.palette.primary.main }}>Models</span>{' '}
            page
          </h2>
        </div>
      ),
      spotlightPadding: 0,
      spotlightClicks: true,
      target: "a[href$='/models']",
      skipLocations: ['/models'],
    },
    {
      content: (
        <div>
          <h2>
            This is the{' '}
            <span style={{ color: theme.palette.primary.main }}>Models</span>{' '}
            page
          </h2>
          Here you can view all the models you have created, select a model for
          training, and create new models.
        </div>
      ),
      placement: 'center',
      target: 'body',
      location: '/models',
    },
  ]

  return (
    <Joyride
      tooltipComponent={OnboardingTooltip}
      callback={internalCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      disableOverlayClose
      disableCloseOnEsc
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      steps={steps}
      styles={{
        options: {
          arrowColor: theme.palette.primary.main,
          overlayColor: 'rgba(0, 0, 0, 0.33)',
          zIndex: 10000,
        },
      }}
    />
  )
}

Onboarding.propTypes = {
  run: PropTypes.bool,
  callback: PropTypes.func,
}
