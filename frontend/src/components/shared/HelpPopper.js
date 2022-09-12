import React from 'react'
import { Box, Card, CardContent, useTheme } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import PropTypes from 'prop-types'

export default function HelpPopper({ helpPopperContent }) {
  const theme = useTheme()
  return (
    <Card sx={{ border: 1, borderColor: theme.palette.primary.main }}>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 1 }}
        >
          <HelpIcon />
        </Box>
        {helpPopperContent}
      </CardContent>
    </Card>
  )
}

HelpPopper.propTypes = {
  helpPopperContent: PropTypes.string.isRequired,
}
