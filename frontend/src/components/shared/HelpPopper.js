import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Popper,
  Typography,
  useTheme,
} from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
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
      sx={{ pointerEvents: 'none', padding: 3 }}
      open={open}
      anchorEl={anchorEl}
      placement={'right'}
      onClose={onClose}
    >
      <Card
        sx={{
          maxWidth: 300,
          border: 1,
          borderColor: theme.palette.primary.main,
          backgroundColor:
            theme.components.MuiCard.styleOverrides.root.backgroundColor,
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
    </Popper>
  )
}

HelpPopper.propTypes = {
  helpPopperContent: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.element.isRequired,
  onClose: PropTypes.func,
}
