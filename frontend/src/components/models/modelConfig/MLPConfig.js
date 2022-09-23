import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import PropTypes from 'prop-types'
import { activationFuncs } from './LayerConfigPopup'

export default function MLPConfig({ updateDefaultActivation }) {
  const [activation, setActivation] = React.useState('')

  return (
    <FormControl fullWidth>
      <InputLabel sx={{ m: 2 }}>Activation Function</InputLabel>
      <Select
        value={activation}
        label="Default Activation Function"
        onChange={(e) => {
          updateDefaultActivation(e.target.value)
          setActivation(e.target.value)
        }}
        sx={{ m: 2 }}
      >
        {activationFuncs.map((func, i) => {
          return (
            <MenuItem key={i} value={func}>
              {func}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

MLPConfig.propTypes = {
  updateDefaultActivation: PropTypes.func.isRequired,
}
