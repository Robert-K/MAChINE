import React from 'react'
import PropTypes from 'prop-types'
import { Box, Popper, TextField } from '@mui/material'
import { camelToNaturalString } from '../../../utils'

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
    explanation: 'Number of nodes in the regressional part of the network',
  },
}

export default function SchNetConfig({
  schnetParams,
  updateFunc,
    errorSignal,
  hoverFunc,
  leaveFunc,
}) {
  const [sizes, setSizes] = React.useState([
    schnetParams.depth,
    schnetParams.embeddingDimension,
    schnetParams.readoutSize,
  ])
  const [sizesError, setSizesError] = React.useState([false, false, false])

    React.useEffect(() => {
    errorSignal(sizesError.includes(true))
  }, [sizesError])

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

  return (
    <div>
      {Object.entries(settableSizes).map(([key, value], i) => {
        return (
          <TextField
            required
            key={i}
            id="outlined-number"
            label={camelToNaturalString(key)}
            type="number"
            defaultValue={sizes[i]}
            error={sizesError[i]}
            helperText={sizesError[i] ? 'Must be above zero!' : ''}
            onChange={(e) => handleChange(e, i, value.min)}
            onMouseOver={(e) => {
              hoverFunc(e, value.explanation)
            }}
            onMouseLeave={leaveFunc}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              m: 2,
            }}
          />
        )
      })}
    </div>
  )
}

SchNetConfig.propTypes = {
  schnetParams: PropTypes.object.isRequired,
  updateFunc: PropTypes.func.isRequired,
    errorSignal: PropTypes.func,
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
}






