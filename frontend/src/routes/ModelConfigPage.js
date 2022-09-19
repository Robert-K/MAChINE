import React from 'react'
import SchNetConfig from '../components/models/modelConfig/SchNetConfig'
import MLPConfig from '../components/models/modelConfig/MLPConfig'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import MLPModelVisual from '../components/models/modelConfig/MLPModelVisual'
import {
  Alert,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Popper,
  Select,
  Snackbar,
  TextField,
} from '@mui/material'
import Button from '@mui/material/Button'
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
      'NAdam',
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

export const toNaturalString = (str) => {
  const splitAtCapitals = str.split(/(?=[A-Z])/)
  const strWithSpaces = splitAtCapitals.join(' ')
  return `${strWithSpaces.charAt(0).toUpperCase()}${strWithSpaces.slice(1)}`
}

export default function ModelConfigPage({ baseModel, addFunc }) {
  const [parameters, setParameters] = React.useState(baseModel.parameters)
  const [defaultActivation, setDefaultActivation] = React.useState('')
  const [name, setName] = React.useState('')
  const [showSnackBar, setShowSnackBar] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)

  function renderTypeSpecificComponents() {
    const children = {}
    let schnetParams
    switch (baseModel.type.name) {
      case 'sequential':
        children.visual = (
          <MLPModelVisual
            modelLayers={baseModel.parameters.layers}
            defaultActivation={defaultActivation}
            updateFunc={updateParameters}
          />
        )
        children.config = (
          <MLPConfig updateDefaultActivation={setDefaultActivation} />
        )
        break
      case 'schnet':
        schnetParams = {
          depth: parameters.depth,
          embeddingDimension: parameters.embeddingDimension,
          readoutSize: parameters.readoutSize,
        }
        children.visual = (
          <div>
            <img src={`graph.png`} alt="" />
          </div>
        )
        children.config = (
          <SchNetConfig
            schnetParams={schnetParams}
            updateFunc={updateParameters}
          />
        )
    }
    return children
  }

  function updateParameters(updatedKey, updatedValue) {
    const newParams = { ...parameters }
    newParams[updatedKey] = updatedValue
    setParameters(newParams)
  }

  function saveModel(e) {
    const newModel = {
      name,
      baseModel: baseModel.id,
      parameters,
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

  const handleHelpPopperOpen = (event, content) => {
    setHelpAnchorEl(event.currentTarget)
    setHelpPopperContent(content)
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
    // setHelpPopperContent('')
  }

  const open = Boolean(helpAnchorEl)

  return (
    <Grid container>
      <Grid item xs={8}>
        {renderTypeSpecificComponents().visual}
      </Grid>
      <Grid item xs={2}>
        <Card sx={{ m: 2, width: '100%', height: '85vh' }}>
          <CardContent>
            {Object.entries(standardParameters).map(([param, value], i) => {
              return (
                <FormControl key={i} fullWidth>
                  <InputLabel sx={{ m: 2 }}>
                    {toNaturalString(param)}
                  </InputLabel>
                  <Select
                    value={parameters[param] || ''}
                    label={toNaturalString(param)}
                    onChange={(event) => handleChange(event, param)}
                    sx={{ m: 2 }}
                    onMouseOver={(e) => {
                      if (help.helpMode) {
                        handleHelpPopperOpen(e, value.explanation)
                      }
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

            {renderTypeSpecificComponents().config}

            <FormControl>
              <TextField
                label="Model Name"
                value={name}
                onChange={(e) => handleNameInput(e)}
                sx={{ m: 2 }}
                required
              />
            </FormControl>
            <Button onClick={(e) => saveModel(e)}>Save</Button>
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
        <Popper
          id="mouse-over-popper-standard"
          sx={{
            pointerEvents: 'none',
            padding: 3,
            boxShadow: 0,
          }}
          open={open}
          anchorEl={helpAnchorEl}
          placement={'right'}
          onClose={handleHelpPopperClose}
        >
          <HelpPopper
            id="helpPopper-standard"
            helpPopperContent={helpPopperContent}
          />
        </Popper>
      </Grid>
    </Grid>
  )
}

ModelConfigPage.propTypes = {
  baseModel: PropTypes.object,
  addFunc: PropTypes.func,
}
