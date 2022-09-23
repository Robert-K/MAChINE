import React from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@mui/material'
import { toNaturalString } from '../../../routes/ModelConfigPage'
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
    explanation: 'Number of nodes in the regressional part of the network',
  },
}

export default function SchNetConfig({
  schnetParams,
  updateFunc,
  hoverFunc,
  leaveFunc,
}) {
  const [sizes, setSizes] = React.useState([
    schnetParams.depth,
    schnetParams.embeddingDimension,
    schnetParams.readoutSize,
  ])
  const [sizesError, setSizesError] = React.useState([false, false, false])
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
                hoverFunc(e, value.explanation)
              }
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
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
}
