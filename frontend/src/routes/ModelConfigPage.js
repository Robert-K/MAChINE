import React from 'react'
import SchNetConfig from '../components/models/modelConfig/SchNetConfig'
import MLPConfig from '../components/models/modelConfig/MLPConfig'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import MLPModelVisual from '../components/models/modelConfig/MLPModelVisual'
import {
  Alert,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from '@mui/material'
import Button from '@mui/material/Button'
import SchNetVisual from '../components/models/modelConfig/SchNetVisual'
import { camelToNaturalString } from '../utils'
import { useLocation, useNavigate } from 'react-router-dom'

export const standardParameters = {
  optimizer: [
    'Adam',
    'Adamax',
    'Stochastic Gradient Descent',
    'RMSprop',
    'Adadelta',
    'Nadam',
    'Adagrad',
    'Ftrl',
  ],
  lossFunction: [
    'Binary Cross Entropy',
    'Huber Loss',
    'Mean Absolute Error',
    'Mean Squared Error',
  ],
}

export default function ModelConfigPage({ addFunc }) {
  const { state } = useLocation()
  const [parameters, setParameters] = React.useState(state.baseModel.parameters)
  const [defaultActivation, setDefaultActivation] = React.useState('')
  const [name, setName] = React.useState('')
  const [isInvalidConfig, setIsInvalidConfig] = React.useState(false)
  const [showSnackBar, setShowSnackBar] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const navigate = useNavigate()

  const modelTypeSpecificComponents = {
    sequential: {
      visual: (
        <MLPModelVisual
          modelLayers={state.baseModel.parameters.layers}
          defaultActivation={defaultActivation}
          updateFunc={updateParameters}
        />
      ),
      config: <MLPConfig updateDefaultActivation={setDefaultActivation} />,
    },
    schnet: {
      visual: <SchNetVisual />,
      config: (
        <SchNetConfig
          schnetParams={{
            depth: parameters.depth,
            embeddingDimension: parameters.embeddingDimension,
            readoutSize: parameters.readoutSize,
          }}
          updateFunc={updateParameters}
          errorSignal={setIsInvalidConfig}
        />
      ),
    },
  }

  function updateParameters(updatedKey, updatedValue) {
    const newParams = { ...parameters }
    newParams[updatedKey] = updatedValue
    setParameters(newParams)
  }

  function saveModel() {
    if (state.baseModel.type.name === 'sequential') {
      parameters.layers.pop()
    }
    const newModel = {
      name,
      baseModelID: state.baseModel.id,
      parameters,
    }
    switch (addFunc(newModel)) {
      case 'duplicate':
        showSnackError(`A model with the name ${name} already exists.`)
        break
      case 'error':
        showSnackError(`The model could not be saved.`)
        break
      default:
        navigate('/models')
    }
  }

  function showSnackError(message) {
    setErrorMessage(message)
    setShowSnackBar(true)
  }

  function handleChange(e, key) {
    const newParams = { ...parameters }
    newParams[key] = e.target.value
    setParameters(newParams)
  }

  function handleNameInput(e) {
    setName(e.target.value)
  }

  return (
    <Grid sx={{ p: 2, height: '85vh' }} container>
      <Grid item xs={8} sx={{ height: '100%' }}>
        <Card sx={{ height: '100%' }}>
          {modelTypeSpecificComponents[state.baseModel.type.name].visual}
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card sx={{ height: '100%', ml: 2 }}>
          <CardContent>
            {Object.entries(standardParameters).map(([param, value], i) => {
              return (
                <FormControl key={i} fullWidth>
                  <InputLabel sx={{ m: 2 }}>
                    {camelToNaturalString(param)}
                  </InputLabel>
                  <Select
                    required
                    value={parameters[param] || ''}
                    label={camelToNaturalString(param)}
                    onChange={(event) => handleChange(event, param)}
                    sx={{ m: 2 }}
                  >
                    {value.map((valueEntry, i) => {
                      return (
                        <MenuItem key={i} value={valueEntry}>
                          {valueEntry}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              )
            })}

            {modelTypeSpecificComponents[state.baseModel.type.name].config}

            <FormControl>
              <TextField
                label="Model Name"
                value={name}
                onChange={(e) => handleNameInput(e)}
                sx={{ m: 2 }}
                required
              />
            </FormControl>
          </CardContent>
          <CardActions>
            <Button disabled={isInvalidConfig || !name} onClick={saveModel}>
              Save
            </Button>
          </CardActions>
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

ModelConfigPage.propTypes = {
  addFunc: PropTypes.func.isRequired,
}
