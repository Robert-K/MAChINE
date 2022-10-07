import React from 'react'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormLabel,
  List,
  ListItem,
} from '@mui/material'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import TrainingContext from '../../context/TrainingContext'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { camelToNaturalString } from '../../utils'

/**
 * label selection component for given dataset
 * sets the selected dataset and labels in the TrainingContext
 * @param dataset given dataset
 * @returns {JSX.Element}
 */
export default function DatasetInfo({ dataset }) {
  const [labelArray, setLabelArray] = React.useState([])
  const [disabledButton, setDisabledButton] = React.useState(true)
  const training = React.useContext(TrainingContext)
  const navigate = useNavigate()

  const handleChecked = (event) => {
    if (labelArray.includes(event.target.value)) {
      setLabelArray([])
      setDisabledButton(true)
    } else {
      setLabelArray([event.target.value])
      setDisabledButton(false)
    }
  }

  const handleStartTrainingClick = () => {
    training.setSelectedDataset(dataset)
    training.setSelectedLabels(labelArray)
    navigate('/training')
  }

  return (
    <Box>
      <Button
        fullWidth
        variant="contained"
        sx={{ mb: 2 }}
        disabled={disabledButton}
        onClick={handleStartTrainingClick}
      >
        {disabledButton ? 'Choose a label' : 'Start Training!'}
      </Button>
      <FormLabel sx={{ ml: 0.5 }}>Label</FormLabel>
      <List sx={{ py: 0, maxHeight: 400, overflow: 'auto' }}>
        {dataset.labelDescriptors.map((descriptor, index) => {
          return (
            <ListItem
              key={`${descriptor}-${index}-${dataset.datasetID}`}
              sx={{ py: 0 }}
            >
              {index === 0 ? null : <Divider></Divider>}
              <FormControlLabel
                control={
                  <Checkbox
                    value={descriptor}
                    checked={labelArray.includes(descriptor)}
                    onClick={handleChecked}
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<RadioButtonCheckedIcon />}
                  />
                }
                label={camelToNaturalString(descriptor)}
              />
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}

DatasetInfo.propTypes = {
  dataset: PropTypes.object,
}
