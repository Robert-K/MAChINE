import React from 'react'
import { Divider, List, ListItem } from '@mui/material'
import Button from '@mui/material/Button'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function DatasetInfo(props) {
  return (
    <List sx={{ maxHeight: 400, maxWidth: 200, overflow: 'auto' }}>
      <Button component={Link} to="/training" variant="contained">
        Start Training!
      </Button>
      {props.dataset.labelDescriptors.map((descriptor, index) => {
        return (
          <ListItem
            key={`${JSON.stringify(descriptor)} ${index.toString()} ${
              props.dataset.datasetID
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
