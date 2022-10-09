import React from 'react'
import { useTheme } from '@mui/material'
import UserContext from '../../context/UserContext'
import TrainingContext from '../../context/TrainingContext'
import Joyride, { ACTIONS, EVENTS } from 'react-joyride'
import { useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import OnboardingTooltip from './OnboardingTooltip'

export default function Onboarding({ run, callback }) {
  const user = React.useContext(UserContext)
  const theme = useTheme()
  const navigate = useNavigate()
  const locationName = useLocation().pathname
  const [stepIndex, setStepIndex] = React.useState(0)
  const training = React.useContext(TrainingContext)

  // Callback runs for every Joyride event
  const internalCallback = (data) => {
    const { action, index, type } = data
    // Reset the step index, so the tour starts from the beginning every time
    if (
      [ACTIONS.START, ACTIONS.RESTART, ACTIONS.CLOSE, ACTIONS.SKIP].includes(
        action
      )
    ) {
      setStepIndex(0)
      // Select example training parameters, so the training page can be shown during tour
      training.selectExampleTrainingParameters()
    }
    // Skip the step if it's skipLocation matches the current location
    if (EVENTS.STEP_BEFORE === type) {
      if (
        steps[index].skipLocations &&
        steps[index].skipLocations.includes(locationName)
      ) {
        setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
      }
      // If the step requires a certain location, navigate to it
      if (steps[index].location) {
        navigate(
          steps[stepIndex].location,
          steps[stepIndex].params ? steps[stepIndex].params : {}
        )
      }
    }
    // Advance (or go back) to the next step
    // Also do this if the target is not found, so the tour can continue
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
    }

    // Call external callback
    callback(data)
  }

  // The steps of the tour
  // steps with skipLocations will be skipped if the current location matches one of the skipLocations
  // steps with location will navigate to the specified location
  // params can be passed to the location
  const steps = [
    {
      content: (
        <div>
          <h2>
            Hi {user.userName}! Welcome to{' '}
            <span style={{ color: theme.palette.primary.main }}>MAChINE</span>!
          </h2>
          This tour will guide you through the most important features of the
          app.
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
    {
      content: <h2>You can add a new model using this button</h2>,
      target: 'button[aria-label="Add item"]',
      location: '/models',
    },
    {
      content: (
        <div>
          <h2>
            Next is selecting a{' '}
            <span style={{ color: theme.palette.primary.main }}>
              base model
            </span>
          </h2>
          Your new model will be based on this pre-configured model.
        </div>
      ),
      placement: 'center',
      target: 'body',
      location: '/models/base-models',
    },
    {
      content: (
        <div>
          <h2>
            The{' '}
            <span style={{ color: theme.palette.primary.main }}>
              Sequential
            </span>{' '}
            base model
          </h2>
          It&apos;s the simplest model type, consisting of a single stack of
          layers. <br />
          However, it offers the most customization options in MAChINE.
        </div>
      ),
      target: '.base-model-card.id-1',
      location: '/models/base-models',
    },
    {
      content: (
        <div>
          <h2>
            The{' '}
            <span style={{ color: theme.palette.primary.main }}>SchNet</span>{' '}
            base model
          </h2>
          SchNet is short for Schrödinger Network. Consisting of a graph neural
          network and a multilayer-perceptron (MLP) component, it&apos; more
          complex than the Sequential model, but also more powerful.
        </div>
      ),
      target: '.base-model-card.id-2',
      location: '/models/base-models',
    },
    {
      content: (
        <div>
          <h2>
            This is the{' '}
            <span style={{ color: theme.palette.primary.main }}>
              model configuration
            </span>{' '}
            page
          </h2>
          Here you can configure various properties of your model.
        </div>
      ),
      placement: 'center',
      target: 'body',
      location: '/models/model-config',
      params: {
        state: {
          baseModel: {
            name: 'SequentialA',
            type: { name: 'sequential', image: null },
            parameters: {
              lossFunction: 'Mean Squared Error',
              optimizer: 'Adam',
              layers: [
                { type: 'Dense', units: 256, activation: 'relu' },
                {
                  type: 'Dense',
                  units: 256,
                  activation: 'relu',
                },
                { type: 'Dense', units: 256, activation: 'relu' },
                { type: 'Dense', units: 1 },
              ],
            },
            id: '1',
          },
        },
      },
    },
    {
      content: (
        <div>
          <h2>
            The{' '}
            <span style={{ color: theme.palette.primary.main }}>
              Network Visualizer
            </span>
            ...
          </h2>
          allows you to add & remove layers and set their activation functions.
        </div>
      ),
      target: '.vis-network',
    },
    {
      content: (
        <div>
          <h2>
            Once you&apos;ve configured your new model, you can start{' '}
            <span style={{ color: theme.palette.primary.main }}>training</span>{' '}
            it
          </h2>
        </div>
      ),
      location: '/models',
      target: 'body',
      placement: 'center',
    },
    {
      content: (
        <div>
          <h2>
            First, select the model, then click this{' '}
            <span style={{ color: theme.palette.primary.main }}>button</span>
          </h2>
        </div>
      ),
      target: '.select-training-data',
    },
    {
      content: (
        <div>
          <h2>
            Next, pick a{' '}
            <span style={{ color: theme.palette.primary.main }}>dataset</span>{' '}
            for training{' '}
          </h2>
        </div>
      ),
      location: '/datasets',
      target: 'body',
      placement: 'center',
    },
    {
      content: (
        <div>
          <h2>
            The dataset determines which{' '}
            <span style={{ color: theme.palette.primary.main }}>
              properties
            </span>{' '}
            of the molecules your model can predict and how well.
          </h2>
        </div>
      ),
      location: '/datasets',
      target: 'button.MuiCardActionArea-root',
    },
    {
      content: (
        <div>
          <h2>
            It&apos;s{' '}
            <span style={{ color: theme.palette.primary.main }}>training</span>{' '}
            time!
          </h2>
          This page allows you to train your model on the selected dataset.
        </div>
      ),
      location: '/training',
      target: 'body',
      placement: 'center',
    },
    {
      content: (
        <div>
          <h2>
            <span style={{ color: theme.palette.primary.main }}>Before</span>{' '}
            you start training...
          </h2>
          you can set the number of epochs and the batch size
          <br /> as well as review your selected model and dataset.
        </div>
      ),
      target: '.MuiGrid-item.MuiGrid-grid-xs-6',
      placement: 'right',
    },
    {
      content: (
        <div>
          <h2>
            <span style={{ color: theme.palette.primary.main }}>Once</span> you
            start training...
          </h2>
          you will see live updates of the training progress in the graph.
        </div>
      ),
      target: '.apexcharts-canvas',
      placement: 'left',
    },
    {
      content: (
        <div>
          <h2>
            Next is{' '}
            <span style={{ color: theme.palette.primary.main }}>molecule</span>{' '}
            creation!
          </h2>
        </div>
      ),
      location: '/molecules',
      target: 'body',
      placement: 'center',
    },
    {
      content: (
        <div>
          <h2>
            You can{' '}
            <span style={{ color: theme.palette.primary.main }}>draw</span> any
            molecule you like
          </h2>
          Feel free to play around!
        </div>
      ),
      target: '.molecule-view',
    },
    {
      content: (
        <div>
          <h2>
            When you&apos;re happy with your molecule, hit{' '}
            <span style={{ color: theme.palette.primary.main }}>analyze</span>
          </h2>
          You will be able to analyze your new molecule with any of your trained
          models and view the results.
        </div>
      ),
      target: '.analyze-button',
    },
    {
      content: (
        <div>
          <h2>
            Finally, you can{' '}
            <span style={{ color: theme.palette.primary.main }}>compare</span>{' '}
            your molecules and models to those of other users.
          </h2>
        </div>
      ),
      location: '/results',
      target: 'body',
      placement: 'center',
    },
    {
      content: (
        <div>
          <h2>
            One last thing:{' '}
            <span style={{ color: theme.palette.primary.main }}>Help mode</span>
            !
          </h2>
          Help mode will give you hints on parameters and panels simply by
          hovering above them. You can always toggle it using this button.
        </div>
      ),
      target: '.help-mode-button',
    },
    {
      content: (
        <div>
          <h2>
            That&apos;s it!{' '}
            <span style={{ color: theme.palette.primary.main }}>Enjoy</span>!
          </h2>
          Thank you for choosing MAChINE for your daily AI molecule property
          prediction needs!
        </div>
      ),
      location: '/models',
      target: 'body',
      placement: 'center',
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
