import React from 'react'
import { Card, CardContent, Popper, Typography, useTheme } from '@mui/material'
import PropTypes from 'prop-types'

export default function HelpPopper({
  helpPopperContent,
  open,
  anchorEl,
  onClose,
}) {
  const theme = useTheme()
  return (
    <Popper
      id="mouse-over-popper"
      sx={{
        pointerEvents: 'none',
        padding: 3,
        zIndex: 100,
      }}
      open={open}
      anchorEl={anchorEl}
      placement={'right'}
      onClose={onClose}
      modifiers={[
        {
          name: 'preventOverflow',
          options: {
            padding: 80,
          },
        },
      ]}
    >
      <Card
        sx={{
          maxWidth: 300,
          border: 1,
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CardContent>
          <Typography style={{ textAlign: 'center', whiteSpace: 'pre-line' }}>
            {helpPopperContent}
          </Typography>
        </CardContent>
      </Card>
    </Popper>
  )
}

HelpPopper.propTypes = {
  helpPopperContent: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.object,
  onClose: PropTypes.func,
}
