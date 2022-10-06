import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import PropTypes from 'prop-types'
import { activationFuncs } from '../../../utils'

/**
 * Configures MLP-specific parameters
 * enables setting of a default selected activation function
 * @param updateDefaultActivation update callback when configuration is changed
 * @param hoverFunc callback for hovering
 * @param leaveFunc callback for mouse pointer leaving component
 * @returns {JSX.Element}
 */
export default function MLPConfig({
  updateDefaultActivation,
  hoverFunc,
  leaveFunc,
}) {
  const [activation, setActivation] = React.useState('ReLU')

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
            'The standard activation function for this model.\nThink of an activation function as the way a neuron decides whether to act on an incoming signal and if so, how much it will react!\nWhen you create a new layer, you can choose its activation function individually, or you can set your default activation function here on the right.'
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
