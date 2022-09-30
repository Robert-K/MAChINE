import React from 'react'
import { useTheme } from '@mui/material'
import UserContext from './context/UserContext'
import Joyride from 'react-joyride'
import OnboardingTooltip from './components/onboarding/OnboardingTooltip'
import PropTypes from 'prop-types'

export default function Onboarding({ run, callback }) {
  const user = React.useContext(UserContext)
  const theme = useTheme()

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
      locale: {
        skip: <strong aria-label="skip">S-K-I-P</strong>,
      },
      placement: 'center',
      target: 'body',
    },
    {
      content: <h2>WOW! A NAVBAR!!!</h2>,
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 20,
      target: '.MuiToolbar-root',
    },
  ]

  return (
    <Joyride
      tooltipComponent={OnboardingTooltip}
      callback={callback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      disableOverlayClose
      disableCloseOnEsc
      showProgress
      showSkipButton
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
