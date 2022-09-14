import React from 'react'
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import PropTypes from 'prop-types'

export default function HelpPopper({ helpPopperContent }) {
  const theme = useTheme()
  return (
    <Card
      sx={{
        maxWidth: 300,
        border: 1,
        borderColor: theme.palette.primary.main,
        backgroundColor:
          theme.components.MuiCard.styleOverrides.root.backgroundColor,
        boxShadow: 0,
      }}
    >
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 1 }}
        >
          <HelpIcon />
        </Box>
        <Typography style={{ textAlign: 'center' }}>
          {helpPopperContent}
        </Typography>
      </CardContent>
    </Card>
  )
}

HelpPopper.propTypes = {
  helpPopperContent: PropTypes.string.isRequired,
}
