import React from 'react'
import { FormControlLabel, Switch } from '@mui/material'
import PropTypes from 'prop-types'

export default function HelpModeSwitch({ initialHelpMode, setModeFunction }) {
  const [helpMode, setHelpMode] = React.useState(initialHelpMode)

  const changeHelpMode = (value) => {
    setHelpMode(value)
  }

  function getHelpMode() {
    return helpMode
  }

  return (
    <FormControlLabel
      control={
        <Switch
          sx={{ color: 'white' }}
          onClick={() => {
            changeHelpMode(!helpMode)
          }}
        ></Switch>
      }
      label="Help?"
    />
  )
}

function getHelpMode() {
  return true
}

HelpModeSwitch.propTypes = {
  initialHelpMode: PropTypes.bool,
  setModeFunction: PropTypes.func,
}
