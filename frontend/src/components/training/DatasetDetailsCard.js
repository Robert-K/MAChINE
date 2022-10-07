import React from 'react'
import { Card, CardContent, ListItem, Typography } from '@mui/material'
import Dataset from '../../internal/Dataset'
import PropTypes from 'prop-types'
import { camelToNaturalString } from '../../utils'

export default function DatasetDetailsCard({
  selectedDataset,
  selectedLabels,
  hoverFunc,
  leaveFunc,
}) {
  return (
    <Card
      sx={{ m: 3 }}
      onMouseOver={(e) => {
        hoverFunc(e)
      }}
      onMouseLeave={leaveFunc}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Dataset Details
        </Typography>
        <Typography>Name: {selectedDataset.name}</Typography>
        <Typography>ID: {selectedDataset.datasetID}</Typography>
        <Typography>Size: {selectedDataset.size}</Typography>
        <Typography>Label:</Typography>
        {selectedLabels.map((label) => (
          <ListItem sx={{ py: 0.1 }} key={label}>
            {camelToNaturalString(label)}
          </ListItem>
        ))}
      </CardContent>
    </Card>
  )
}

DatasetDetailsCard.propTypes = {
  selectedDataset: PropTypes.object,
  selectedLabels: PropTypes.array,
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
}

DatasetDetailsCard.defaultProps = {
  selectedDataset: new Dataset('ERROR', 'ERROR', 0, ['ERROR']),
  selectedLabels: ['ERROR'],
}
