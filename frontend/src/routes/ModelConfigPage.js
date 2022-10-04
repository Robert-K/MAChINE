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
import HelpContext from '../context/HelpContext'
import HelpPopper from '../components/shared/HelpPopper'

export const standardParameters = {
  optimizer: {
    options: [
      'Adam',
      'Adamax',
      'Stochastic Gradient Descent',
      'RMSprop',
      'Adadelta',
      'Adagrad',
      'Nadam',
      'Ftrl',
    ],
    explanation:
      'The optimizer plays an important part in training your model. It decides how the parameters of your net will be tweaked to make the net better!',
  },
  lossFunction: {
    options: [
      'Binary Cross Entropy',
      'Huber Loss',
      'Mean Absolute Error',
      'Mean Squared Error',
    ],
    explanation:
      "The loss of your net describes now 'bad' your net is, that is, how big the difference between the actual output and the desired output is. The loss function determines how this loss is calculated.",
  },
}

export default function ModelConfigPage({ addFunc }) {
  const { state } = useLocation()
  const [parameters, setParameters] = React.useState(state.baseModel.parameters)
  const [defaultActivation, setDefaultActivation] = React.useState('ReLU')
  const [name, setName] = React.useState('')
  const [isInvalidConfig, setIsInvalidConfig] = React.useState(false)
  const [showSnackBar, setShowSnackBar] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)
  const navigate = useNavigate()

  const handleHelpPopperOpen = (event, content) => {
    if (help.helpMode) {
      setHelpAnchorEl(event.currentTarget)
      setHelpPopperContent(content)
    }
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
  }

  const helpOpen = Boolean(helpAnchorEl)

  const modelTypeSpecificComponents = {
    sequential: {
      visual: (
        <MLPModelVisual
          modelLayers={state.baseModel.parameters.layers}
          defaultActivation={defaultActivation}
          updateFunc={updateParameters}
          hoverFunc={(e) => {
            handleHelpPopperOpen(
              e,
              'This is how your model looks at the moment. Each rectangle represents one layer. On the left is the input layer, and the data will get forwarded from left to right through the layers.\nThe numbers show how many nodes are in the respective layer.\nClick between two layers to add a new layer between them, or click directly on a layer to delete it.'
            )
          }}
          leaveFunc={handleHelpPopperClose}
        />
      ),
      config: (
        <MLPConfig
          updateDefaultActivation={setDefaultActivation}
          hoverFunc={handleHelpPopperOpen}
          leaveFunc={handleHelpPopperClose}
        />
      ),
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
          hoverFunc={handleHelpPopperOpen}
          leaveFunc={handleHelpPopperClose}
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
    <Grid sx={{ p: 2, height: '87vh' }} container>
      <Grid item xs={8} sx={{ height: '100%' }}>
        <Card sx={{ height: '100%' }}>
          {modelTypeSpecificComponents[state.baseModel.type.name].visual}
        </Card>
      </Grid>
      <Grid item xs={4} sx={{ height: '100%' }}>
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
                    onMouseOver={(e) => {
                      handleHelpPopperOpen(e, value.explanation)
                    }}
                    onMouseLeave={handleHelpPopperClose}
                  >
                    {value.options.map((valueEntry, i) => {
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
        <HelpPopper
          id="helpPopper"
          helpPopperContent={helpPopperContent}
          open={helpOpen}
          anchorEl={helpAnchorEl}
          onClose={handleHelpPopperClose}
        />
      </Grid>
    </Grid>
  )
}

ModelConfigPage.propTypes = {
  addFunc: PropTypes.func.isRequired,
}
