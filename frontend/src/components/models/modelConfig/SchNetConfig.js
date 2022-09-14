import React from 'react'
import PropTypes from 'prop-types'
import { Box, Popper, TextField } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import { toNaturalString } from '../../../routes/ModelConfigPage'

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

export default function SchNetConfig({
  schnetParams,
  updateFunc,
  errorSignal,
}) {
  const [sizes, setSizes] = React.useState([
    schnetParams.depth,
    schnetParams.embeddingDimension,
    schnetParams.readoutSize,
  ])
  const [sizesError, setSizesError] = React.useState([false, false, false])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [popperContent, setPopperContent] = React.useState('')

  React.useEffect(() => {
    errorSignal(sizesError.includes(true))
  }, [sizesError])

  const handleChange = (event, i, key, min) => {
    const sizesErrorClone = [...sizesError]
    sizesErrorClone[i] = event.target.value < min
    setSizesError(sizesErrorClone)
    if (event.target.value >= min) {
      const sizesClone = [...sizes]
      sizesClone[i] = event.target.value
      updateFunc(key, event.target.value)
      setSizes(sizesClone)
    }
  }

  const handlePopperOpen = (event, content) => {
    setAnchorEl(event.currentTarget)
    setPopperContent(content)
  }

  const handlePopperClose = () => {
    setAnchorEl(null)
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
            helperText={sizesError[i] ? 'Must be a number above zero!' : ''}
            onChange={(e) => handleChange(e, i, key, value.min)}
            onMouseOver={(e) => {
              handlePopperOpen(e, value.explanation)
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
        }}
        open={open}
        anchorEl={anchorEl}
        placement={'right'}
        onClose={handlePopperClose}
      >
        <Box sx={{ border: 1 }}>
          <HelpIcon />
          {popperContent}
        </Box>
      </Popper>
    </div>
  )
}

SchNetConfig.propTypes = {
  schnetParams: PropTypes.object.isRequired,
  updateFunc: PropTypes.func.isRequired,
  errorSignal: PropTypes.func,
}
