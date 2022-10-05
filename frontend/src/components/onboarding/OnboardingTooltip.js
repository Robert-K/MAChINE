import { Card, CardActions, CardContent, Button, useTheme } from '@mui/material'
import React from 'react'
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
