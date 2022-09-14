import React from 'react'
import { Alert, Snackbar } from '@mui/material'
import PropTypes from 'prop-types'

export default function SnackBarAlert({ open, message, onClose, severity }) {
  return (
    <Snackbar open={open} onClose={onClose} key="error-snack">
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

SnackBarAlert.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  onClose: PropTypes.func,
  severity: PropTypes.string,
}

SnackBarAlert.defaultProps = {
  severity: 'warning',
}
