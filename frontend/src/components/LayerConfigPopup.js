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

export default function LayerConfigPopup() {
  const [activation, setActivation] = React.useState('')
  const [units, setUnits] = React.useState(0)
  const activationFuncs = [
    'Relu',
    'Sigmoid',
    'Softmax',
    'Softplus',
    'Softsign',
    'Tanh',
    'Selu',
    'Elu',
    'Exponential',
  ]

  const close = () => {
    // TODO: trigger popper close
  }

  const handleSelect = (event) => {
    setActivation(event.target.value)
  }

  const handleUnitInput = (event) => {
    setUnits(event.target.value)
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
            label="Activation Function"
            value={activation}
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
            label="Units"
            value={units}
            onChange={(e) => handleUnitInput(e)}
            sx={{ m: 1 }}
            required
          />
        </FormControl>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Button sx={{ m: 1 }} onClick={close}>
            Cancel
          </Button>
          <Button sx={{ m: 1 }} onClick={close}>
            Create
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
