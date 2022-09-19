import React from 'react'
import { Card, CardActions, CardContent, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import PropTypes from 'prop-types'

export default function LayerDeletionPopup({ deleteFunc, cancelFunc }) {
  return (
    <Card>
      <CardContent>
        <Typography>Delete this layer?</Typography>
      </CardContent>
      <CardActions>
        <Button onClick={cancelFunc}>No</Button>
        <Button onClick={deleteFunc}>Yes</Button>
      </CardActions>
    </Card>
  )
}

LayerDeletionPopup.propTypes = {
  deleteFunc: PropTypes.func.isRequired,
  cancelFunc: PropTypes.func.isRequired,
}
