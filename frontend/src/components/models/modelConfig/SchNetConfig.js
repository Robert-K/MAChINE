import React from 'react'
import PropTypes from 'prop-types'
import { Popper, TextField } from '@mui/material'
import { toNaturalString } from '../../../routes/ModelConfigPage'
import HelpPopper from '../../shared/HelpPopper'

const settableSizes = {
  depth: {
    min: 1,
    explanation: 'How many layers the net will have',
  },
  embeddingDimension: {
    min: 1,
    explanation: 'Dimension of node embedding space',
  },
  readoutSize: {
    min: 1,
    explanation: 'Dimension of last layer?',
  },
}

export default function SchNetConfig({ schnetParams, updateFunc }) {
  const [sizes, setSizes] = React.useState([
    schnetParams.depth,
    schnetParams.embeddingDimension,
    schnetParams.readoutSize,
  ])
  const [sizesError, setSizesError] = React.useState([false, false, false])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [popperContent, setPopperContent] = React.useState('')

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

  const handlePopperOpen = (event, content) => {
    setAnchorEl(event.currentTarget)
    setPopperContent(content)
  }

  const handlePopperClose = () => {
    setAnchorEl(null)
    // setPopperContent('')
  }

  const open = Boolean(anchorEl)

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
              // if (HelpModeButton.getHelpMode()) {
              handlePopperOpen(e, value.explanation)
              // }
            }}
            onMouseLeave={handlePopperClose}
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
        anchorEl={anchorEl}
        placement={'right'}
        onClose={handlePopperClose}
      >
        <HelpPopper id="helpPopper" helpPopperContent={popperContent} />
      </Popper>
    </div>
  )
}

SchNetConfig.propTypes = {
  schnetParams: PropTypes.object.isRequired,
  updateFunc: PropTypes.func.isRequired,
}
