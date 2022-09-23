import React from 'react'
import { Box, Card, CardActions, CardContent, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import PropTypes from 'prop-types'

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
