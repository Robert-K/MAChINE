import React from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Popper,
  Select,
} from '@mui/material'
import PropTypes from 'prop-types'
import { activationFuncs } from './LayerConfigPopup'
import HelpPopper from '../../shared/HelpPopper'
import HelpContext from '../../../context/HelpContext'

export default function MLPConfig({ updateDefaultActivation }) {
  const [activation, setActivation] = React.useState('')
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)

  const handleHelpPopperOpen = (event, content) => {
    setHelpAnchorEl(event.currentTarget)
    setHelpPopperContent(content)
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
    // setHelpPopperContent('')
  }

  const open = Boolean(helpAnchorEl)

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
          if (help.helpMode) {
            handleHelpPopperOpen(
              e,
              'The standard activation function for this model. Think of an activation function as the way a neuron decides whether to act on an incoming signal and if so, how much it will react!'
            )
          }
        }}
        onMouseLeave={handleHelpPopperClose}
      >
        {activationFuncs.map((func, i) => {
          return (
            <MenuItem key={i} value={func}>
              {func}
            </MenuItem>
          )
        })}
      </Select>
      <Popper
        id="mouse-over-popper"
        sx={{
          pointerEvents: 'none',
          padding: 3,
        }}
        open={open}
        anchorEl={helpAnchorEl}
        placement={'right'}
        onClose={handleHelpPopperClose}
      >
        <HelpPopper id="helpPopper" helpPopperContent={helpPopperContent} />
      </Popper>
    </FormControl>
  )
}

MLPConfig.propTypes = {
  updateDefaultActivation: PropTypes.func.isRequired,
}
