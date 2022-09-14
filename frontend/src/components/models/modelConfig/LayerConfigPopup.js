import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import React from 'react'
import Button from '@mui/material/Button'
import PropTypes from 'prop-types'

export const activationFuncs = [
  'linear',
  'relu',
  'sigmoid',
  'softmax',
  'softplus',
  'softsign',
  'tanh',
  'selu',
  'elu',
  'exponential',
]

export default function LayerConfigPopup({
  passConfig,
  cancelConfig,
  defaultActivation,
}) {
  const [activation, setActivation] = React.useState('')
  const [units, setUnits] = React.useState(0)
  const [error, setError] = React.useState(false)

  const handleSubmit = () => {
    passConfig(units, activation)
  }

  const handleCancel = () => {
    cancelConfig()
  }

  const handleUnitInput = (e) => {
    setError(e.target.value < 1)
    if (e.target.value > 0) {
      setUnits(e.target.value)
    }
  }

  const handleSelect = (event) => {
    setActivation(event.target.value)
  }

  return (
    <Card
      sx={{
        width: '15vw',
        position: 'absolute',
      }}
    >
      <CardContent>
        <FormControl fullWidth>
          <InputLabel sx={{ m: 1 }}>Activation Function</InputLabel>
          <Select
            required
            label="Activation Function"
            value={activation || defaultActivation}
            onChange={(event) => handleSelect(event)}
            sx={{ m: 1 }}
          >
            {activationFuncs.map((func, index) => {
              return (
                <MenuItem key={index.toString()} value={func}>
                  {func}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            type="number"
            label="Units"
            error={error}
            helperText={error ? 'This needs to be a number > 0.' : ''}
            defaultValue={1}
            onChange={(e) => handleUnitInput(e)}
            sx={{ m: 1 }}
            required
          />
        </FormControl>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Button sx={{ m: 1 }} onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={!activation || !units || error}
            sx={{ m: 1 }}
            onClick={handleSubmit}
          >
            Create
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

LayerConfigPopup.propTypes = {
  passConfig: PropTypes.func.isRequired,
  cancelConfig: PropTypes.func.isRequired,
  defaultActivation: PropTypes.string,
}
