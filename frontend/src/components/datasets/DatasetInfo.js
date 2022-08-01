import React from 'react'
import { Divider, List, ListItem, Button } from '@mui/material'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function DatasetInfo({ dataset }) {
  return (
    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
      <Button fullWidth component={Link} to="/training" variant="contained">
        Start Training!
      </Button>
      {dataset.labelDescriptors.map((descriptor, index) => {
        return (
          <ListItem
            key={`${JSON.stringify(descriptor)} ${index.toString()} ${
              dataset.datasetID
            }`}
          >
            {index === 0 ? null : <Divider></Divider>}
            {descriptor}
          </ListItem>
        )
      })}
    </List>
  )
}

DatasetInfo.propTypes = {
  dataset: PropTypes.object,
}
