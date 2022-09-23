import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import PropTypes from 'prop-types'
import { activationFuncs } from './LayerConfigPopup'
import HelpContext from '../../../context/HelpContext'

export default function MLPConfig({
  updateDefaultActivation,
  hoverFunc,
  leaveFunc,
}) {
  const [activation, setActivation] = React.useState('')
  const help = React.useContext(HelpContext)

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
        onMouseOver={(e) => {
          hoverFunc(
            e,
            'The standard activation function for this model. Think of an activation function as the way a neuron decides whether to act on an incoming signal and if so, how much it will react!'
          )
        }}
        onMouseLeave={leaveFunc}
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
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
}
