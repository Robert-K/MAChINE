import React from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'

/**
 * Deletion menu
 * @param deleteFunc callback for confirmed deletion
 * @param cancelFunc callback for aborted deletion
 * @returns {JSX.Element}
 */
export default function LayerDeletionPopup({ deleteFunc, cancelFunc }) {
  return (
    <Card sx={{ width: '185px' }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography>Delete this layer?</Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ mx: 'auto' }}>
          <Button onClick={cancelFunc}>No</Button>
          <Button onClick={deleteFunc}>Yes</Button>
        </Box>
      </CardActions>
    </Card>
  )
}

LayerDeletionPopup.propTypes = {
  deleteFunc: PropTypes.func.isRequired,
  cancelFunc: PropTypes.func.isRequired,
}
