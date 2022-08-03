import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import LayerVisual from './LayerVisual'
import PropTypes from 'prop-types'

export default function ModelVisual(props) {
  return (
    <Card>
      <CardContent>
        <Typography>Model visualized here.</Typography>
        {props.model.layers.map((layer, index) => {
          return <LayerVisual layer={layer} key={index} />
        })}
      </CardContent>
    </Card>
  )
}

ModelVisual.propTypes = {
  model: PropTypes.object,
}
