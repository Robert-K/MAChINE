import React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
} from '@mui/material'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function DatasetInfo({ dataset }) {
  const [labelArray, setLabelArray] = React.useState([])
  const [disabledButton, setDisabledButton] = React.useState(true)

  const handleChecked = (event) => {
    // TODO: Vielleicht etwas mehr darauf auslegen, dass man später mehr Label auswählen kann
    if (labelArray.includes(event.target.value)) {
      setLabelArray([])
      setDisabledButton(true)
    } else {
      setLabelArray([event.target.value])
      setDisabledButton(false)
    }
  }

  return (
    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
      <Button
        fullWidth
        component={Link}
        to="/training"
        variant="contained"
        sx={{ mb: 2 }}
        disabled={disabledButton}
      >
        {`${disabledButton ? 'Choose a label' : 'Start Training!'}`}
      </Button>
      <FormLabel sx={{ ml: 0.5 }}>Label</FormLabel>
      {dataset.labelDescriptors.map((descriptor, index) => {
        return (
          <ListItem
            key={`${JSON.stringify(descriptor)} ${index.toString()} ${
              dataset.datasetID
            }`}
          >
            {index === 0 ? null : <Divider></Divider>}
            <FormControlLabel
              control={
                <Checkbox
                  value={descriptor}
                  checked={labelArray.includes(descriptor)}
                  onClick={handleChecked}
                />
              }
              label={descriptor}
            />
          </ListItem>
        )
      })}
    </List>
  )
}

DatasetInfo.propTypes = {
  dataset: PropTypes.object,
}
