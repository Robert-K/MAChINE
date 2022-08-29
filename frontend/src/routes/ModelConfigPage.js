import React from 'react'
// import { List, TextField } from '@mui/material'
// import Button from '@mui/material/Button'
// import api from '../api'
// import Layer from '../internal/Layer'
// import LayerVisual from '../components/LayerVisual'
import { useLocation } from 'react-router-dom'
import ModelVisual from '../components/ModelVisual'
import Grid from '@mui/material/Grid'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export default function ModelConfigPage() {
  const { state } = useLocation()
  const baseModel = state.baseModel

  const settableParameters = {
    Optimizer: ['Adam', 'Adamax', 'Stochastic Gradient Descent'],
    Loss: [
      'Mean Squared Error',
      'Mean Absolute Error',
      'Huber Loss',
      'Binary Cross Entropy',
    ],
  }

  const [funcs, setFuncs] = React.useState(['', ''])
  const handleChange = (event, i) => {
    const funcsClone = [...funcs]
    funcsClone[i] = event.target.value
    setFuncs(funcsClone)
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={8}>
          <ModelVisual model={baseModel} />
        </Grid>
        <Grid item xs={4}>
          {Object.entries(settableParameters).map(([key, value], i) => {
            return (
              <Box key={i} sx={{ minWidth: 120, m: 2 }}>
                <FormControl required fullWidth>
                  <InputLabel id="select-function-label">{key}</InputLabel>
                  <Select
                    labelId="select-function"
                    id={i}
                    value={funcs[i]}
                    label={key}
                    onChange={(e) => handleChange(e, i)}
                  >
                    {value.map((valueEntry, i) => {
                      return (
                        <MenuItem key={valueEntry} value={valueEntry}>
                          {valueEntry}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Box>
            )
          })}
        </Grid>
      </Grid>
    </div>
  )
}
