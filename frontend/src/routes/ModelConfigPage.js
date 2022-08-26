import React from 'react'
import Grid from '@mui/material/Grid'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export default function ModelConfigPage() {
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
          {/* Placeholder bc we actually want the visualization to be here */}
        </Grid>
        <Grid item xs={4}>
          <React.Fragment key={JSON.stringify(settableParameters.parameter)}>
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

                /*

                <Box key={i}>
                  <ListItemButton key={i} onClick={() => toggleExpand(i)}>
                    {key}
                    {expand[i] ? <ExpandLess /> : <ExpandMore />}{' '}
                  </ListItemButton>
                  <Collapse
                    in={expand[i]}
                    timeout="auto"
                    mountOnEnter
                    unmountOnExit
                    orientation="vertical"
                  >
                    <List component="div" dense>
                      {value.map((valueEntry, i) => {
                        return (
                          <ListItem sx={{ pl: 4 }} key={i}>
                            <ListItemText>{valueEntry}</ListItemText>
                          </ListItem>
                        )
                      })}
                    </List>
                  </Collapse>
                </Box>
                */
              )
            })}
          </React.Fragment>
        </Grid>
      </Grid>
    </div>
  )
}
