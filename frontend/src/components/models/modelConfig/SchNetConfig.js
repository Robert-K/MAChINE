import React from 'react'
import PropTypes from 'prop-types'
import { Popper, TextField } from '@mui/material'
import { toNaturalString } from '../../../routes/ModelConfigPage'
import HelpPopper from '../../shared/HelpPopper'
import HelpContext from '../../../context/HelpContext'

const settableSizes = {
  depth: {
    min: 1,
    explanation: 'This defines how many layers your net will have',
  },
  embeddingDimension: {
    min: 1,
    explanation: 'This defines how many values each node corresponds to',
  },
  readoutSize: {
    min: 1,
    // todo ask andre
    explanation: 'ask Andre',
  },
}

export default function SchNetConfig({ schnetParams, updateFunc }) {
  const [sizes, setSizes] = React.useState([
    schnetParams.depth,
    schnetParams.embeddingDimension,
    schnetParams.readoutSize,
  ])
  const [sizesError, setSizesError] = React.useState([false, false, false])
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)

  const handleChange = (event, i, min) => {
    const sizesErrorClone = [...sizesError]
    sizesErrorClone[i] = event.target.value < min
    setSizesError(sizesErrorClone)
    if (event.target.value >= min) {
      const sizesClone = [...sizes]
      sizesClone[i] = event.target.value
      setSizes(sizesClone)
    }
  }

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
    <div>
      {Object.entries(settableSizes).map(([key, value], i) => {
        return (
          <TextField
            required
            key={i}
            id="outlined-number"
            label={toNaturalString(key)}
            type="number"
            defaultValue={sizes[i]}
            error={sizesError[i]}
            helperText={sizesError[i] ? 'Must be above zero!' : ''}
            onChange={(e) => handleChange(e, i, value.min)}
            onMouseOver={(e) => {
              if (help.helpMode) {
                handleHelpPopperOpen(e, value.explanation)
              }
            }}
            onMouseLeave={handleHelpPopperClose}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              m: 2,
            }}
          />
        )
      })}
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
    </div>
  )
}

SchNetConfig.propTypes = {
  schnetParams: PropTypes.object.isRequired,
  updateFunc: PropTypes.func.isRequired,
}
