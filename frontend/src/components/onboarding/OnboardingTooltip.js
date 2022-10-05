import { Card, CardActions, CardContent, Button, useTheme } from '@mui/material'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

export default function OnboardingTooltip({
  index,
  size,
  step,
  tooltipProps,
  primaryProps,
  backProps,
  skipProps,
}) {
  const theme = useTheme()

  const fixFloater = () => {
    // This dirty fix is needed because of a strange Firefox bug:
    // The react-joyride floater div comes with a drop-shadow filter
    // The filter causes it to become invisible in Firefox
    // This is a workaround to remove the filter, as react-joyride does not provide a way to do this
    const floater = document.getElementsByClassName(
      '__floater __floater__open'
    )[0]
    if (floater) {
      floater.style.filter = 'none'
    }
  }

  useEffect(() => {
    fixFloater()
  }, [index, size, step, tooltipProps, primaryProps, backProps, skipProps])

  return (
    <Card
      {...tooltipProps}
      sx={{
        backgroundColor: theme.palette.background.default,
        border: `2px solid ${theme.palette.primary.main}`,
      }}
    >
      <CardContent sx={{ maxWidth: '70vw' }}>
        <p
          style={{
            position: 'absolute',
            right: 20,
            margin: 0,
            fontWeight: 'bold',
          }}
        >
          {index + 1} / {size}
        </p>
        <img
          alt="Molele!"
          style={{ maxWidth: 100, margin: 'auto', display: 'block' }}
          src={theme.home.mascot}
          className="swing"
        />
        {step.content}
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="text"
          {...skipProps}
          sx={{ mr: 'auto !important' }}
        >
          Cancel
        </Button>
        <Button color="primary" variant="text" {...primaryProps}>
          Next{index === 0 ? ' (ENTER)' : ''}
        </Button>
      </CardActions>
    </Card>
  )
}

OnboardingTooltip.propTypes = {
  index: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  step: PropTypes.object.isRequired,
  tooltipProps: PropTypes.object.isRequired,
  primaryProps: PropTypes.object.isRequired,
  backProps: PropTypes.object.isRequired,
  skipProps: PropTypes.object.isRequired,
}
