import React from 'react'
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import MLPModelVisual from './MLPModelVisual'
import PropTypes from 'prop-types'

export default function MLPConfig({ model }) {
  const [funcs, setFuncs] = React.useState(['', ''])
  const handleChange = (event, i) => {
    const funcsClone = [...funcs]
    funcsClone[i] = event.target.value
    setFuncs(funcsClone)
  }
  const settableParameters = {
    Optimizer: ['Adam', 'Adamax', 'Stochastic Gradient Descent'],
    Loss: [
      'Binary Cross Entropy',
      'Huber Loss',
      'Mean Absolute Error',
      'Mean Squared Error',
    ],
  }
  return (
    <Grid container sx={{ m: 2 }}>
      <Grid item xs={8}>
        <MLPModelVisual model={model} />
      </Grid>
      <Grid item xs={2}>
        <Card>
          <CardContent>
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
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

MLPConfig.propTypes = {
  model: PropTypes.object.isRequired,
}
