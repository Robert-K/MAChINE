import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import Grid from '@mui/material/Grid'

export default function SchNetConfig({ model }) {
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
    <Grid container>
      <Grid item xs={8}>
        Insert GNN image here
      </Grid>
      <Grid item xs={2}>
        <Card sx={{ m: 2, width: '100%' }}>
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

SchNetConfig.propTypes = {
  model: PropTypes.object.isRequired,
}
