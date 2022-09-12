import React from 'react'
import {
  Alert,
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from '@mui/material'
import MLPModelVisual from './MLPModelVisual'
import PropTypes from 'prop-types'
import { activationFuncs } from './LayerConfigPopup'
import Button from '@mui/material/Button'

export default function MLPConfig({ model, addFunc }) {
  const [funcs, setFuncs] = React.useState(['', '', ''])
  const [name, setName] = React.useState('')
  const [layers, setLayers] = React.useState(model.parameters.layers)
  const [showSnackBar, setShowSnackBar] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const settableParameters = {
    Optimizer: ['Adam', 'Adamax', 'Stochastic Gradient Descent'],
    Loss: [
      'Binary Cross Entropy',
      'Huber Loss',
      'Mean Absolute Error',
      'Mean Squared Error',
    ],
    'Default Activation': activationFuncs,
  }

  const handleChange = (event, i) => {
    const funcsClone = [...funcs]
    funcsClone[i] = event.target.value
    setFuncs(funcsClone)
  }

  function handleNameInput(e) {
    setName(e.target.value)
  }

  function showSnackError(message) {
    setErrorMessage(message)
    setShowSnackBar(true)
  }

  function saveModel(e) {
    const newModel = {
      name,
      baseModel: model.id,
      parameters: {
        optimizer: funcs[0],
        loss: funcs[1],
        layers,
      },
    }
    switch (addFunc(newModel)) {
      case 'duplicate':
        showSnackError(`A model with the name ${name} already exists.`)
        break
      case 'error':
        showSnackError(`The model could not be saved.`)
        break
      case 0:
      // TODO: add snackbar confirm, "Model saved" or sth
    }
  }

  return (
    <Grid container>
      <Grid item xs={8}>
        <MLPModelVisual
          modelLayers={model.parameters.layers}
          defaultActivation={funcs[2]}
          updateFunc={setLayers}
        />
      </Grid>
      <Grid item xs={2}>
        <Card sx={{ m: 2, width: '100%', height: '80vh' }}>
          <CardContent>
            {Object.entries(settableParameters).map(([key, value], i) => {
              return (
                <Box key={i} sx={{ m: 2 }}>
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
            <Box sx={{ m: 2 }} alignSelf="end">
              <FormControl>
                <TextField
                  label="Model Name"
                  value={name}
                  onChange={(e) => handleNameInput(e)}
                  required
                  fullWidth
                ></TextField>
              </FormControl>
              <Button onClick={(e) => saveModel(e)}>Save</Button>
            </Box>
          </CardContent>
        </Card>
        <Snackbar
          open={showSnackBar}
          onClose={() => setShowSnackBar(false)}
          key="error-snack"
        >
          <Alert
            onClose={() => setShowSnackBar(false)}
            severity="warning"
            sx={{ width: '100%' }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  )
}

MLPConfig.propTypes = {
  model: PropTypes.object.isRequired,
  addFunc: PropTypes.func.isRequired,
}
