import React from 'react'
import { Card, CardContent, Popper, Typography, useTheme } from '@mui/material'
import PropTypes from 'prop-types'

/**
 *
 * @param helpPopperContent The text that will be displayed in the help popper
 * @param open Whether the popper is open or not
 * @param anchorEl Where the popper will be placed
 * @returns {JSX.Element} The MUI card with helpful text inside
 * @constructor The constructor of the popper.
 */
export default function HelpPopper({ helpPopperContent, open, anchorEl }) {
  const theme = useTheme()
  return (
    <Popper
      id="mouse-over-popper"
      sx={{
        pointerEvents: 'none',
        padding: 3,
      }}
      open={open}
      anchorEl={anchorEl}
      placement={'right'}
      modifiers={[
        {
          // Ensures that the popper doesn't disappear behind the navbar
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
          {/** whiteSpace: 'pre-line' is necessary to make \n-Linebreaks work within the popper **/}
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
}
