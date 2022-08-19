import React from 'react'
import { Card, CardContent, ListItem, Typography } from '@mui/material'
import PropTypes from 'prop-types'

export default function ModelDetailsCard({ selectedModel }) {
  return (
    <Card sx={{ m: 3 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Model Details
        </Typography>
        <Typography>Name: {selectedModel.name}</Typography>
        <Typography>Base Model: {selectedModel.baseModel}</Typography>
        <Typography>Parameters: </Typography>
        {Object.values(selectedModel.parameters).map((value, index) => {
          return (
            <div key={index}>
              <ListItem sx={{ py: 0.1 }}>{value}</ListItem>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

ModelDetailsCard.propTypes = {
  selectedModel: PropTypes.object.isRequired,
}
