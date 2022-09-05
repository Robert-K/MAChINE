import React from 'react'
import { useLocation } from 'react-router-dom'
import MLPModelVisual from '../components/ModelConfig/MLPModelVisual'
import Grid from '@mui/material/Grid'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export default function ModelConfigPage() {
  const { state } = useLocation()
  const baseModel = state.baseModel

  const settableParameters = {
    Optimizer: ['Adam', 'Adamax', 'Stochastic Gradient Descent'],
    Loss: [
      'Binary Cross Entropy',
      'Huber Loss',
      'Mean Absolute Error',
      'Mean Squared Error',
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
          <MLPModelVisual model={baseModel} />
        </Grid>
        <Grid item xs={4}>
          {Object.entries(settableParameters).map(([key, value], i) => {
            return (
              <Box key={i} sx={{ minWidth: 120, m: 2 }}>
                <FormControl required fullWidth>
                  <InputLabel id="select-function-label">{key}</InputLabel>
                  <Select
                    labelId="select-function"
                    id={i.toString()}
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
