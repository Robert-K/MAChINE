import React from 'react'
import { Card, CardContent, ListItem, Typography } from '@mui/material'
import PropTypes from 'prop-types'

export default function DatasetDetailsCard({
  selectedDataset,
  selectedLabels,
}) {
  return (
    <Card sx={{ m: 3 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Dataset Details
        </Typography>
        <Typography>ID: {selectedDataset.datasetID}</Typography>
        <Typography>Size: {selectedDataset.size}</Typography>
        <Typography>Label:</Typography>
        {selectedLabels.map((label) => (
          <ListItem sx={{ py: 0.1 }} key={label}>
            {label}
          </ListItem>
        ))}
      </CardContent>
    </Card>
  )
}

DatasetDetailsCard.propTypes = {
  selectedDataset: PropTypes.object.isRequired,
  selectedLabels: PropTypes.array.isRequired,
}
