import React from 'react'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material'
import Button from '@mui/material/Button'
import SelectionList from '../components/shared/SelectionList'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import TrainingContext from '../context/TrainingContext'
import HelpPopper from '../components/shared/HelpPopper'
import HelpContext from '../context/HelpContext'
import { camelToNaturalString } from '../utils'

const gridHeight = '80vh'
/**
 * Depicts a list of saved models and shows a description of the selected model on click
 */
export default function ModelsPage({ modelList, initSelectedIndex }) {
  const [selectedIndex, setSelectedIndex] = React.useState(initSelectedIndex)
  const [showDialog, setShowDialog] = React.useState(false)
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const training = React.useContext(TrainingContext)
  const navigate = useNavigate()
  const [helpPopperContent, setHelpPopperContent] = React.useState('')

  const help = React.useContext(HelpContext)

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

  const updateSelection = (index) => {
    setSelectedIndex(index)
  }

  const initiateCreation = () => {
    navigate('base-models')
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
  }

  const handleOpenDialog = () => {
    setShowDialog(true)
  }

  const abortAndShowTraining = () => {
    abortTraining()
    navigate('/training')
  }

  const abortTraining = () => {
    training.stopTraining()
    handleCloseDialog()
  }
  return (
    <Box sx={{ m: 5 }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        columnSpacing={2}
      >
        <Grid
          item
          xs={3}
          onMouseOver={(e) => {
            handleHelpPopperOpen(
              e,
              "This is a list of all models you have created so far. \n Click on any one of them to get more information about it, or click on 'Add a model' to add a new one to the list."
            )
          }}
          onMouseLeave={handleHelpPopperClose}
        >
          <SelectionList
            updateFunc={updateSelection}
            elements={modelList}
            elementType="model"
            usePopper={false}
            addFunc={initiateCreation}
            height={gridHeight}
            pageName={'models'}
          />
        </Grid>
        <Grid item xs={9}>
          <ModelDescription
            selectedModel={modelList[selectedIndex]}
            onActiveTraining={handleOpenDialog}
            hoverFunc={handleHelpPopperOpen}
            leaveFunc={handleHelpPopperClose}
          />
        </Grid>
      </Grid>
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Abort current training?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            To start a new training, you have to abort the current training
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={abortAndShowTraining}>Abort & Show Results</Button>
          <Button onClick={abortTraining}>Abort</Button>
        </DialogActions>
      </Dialog>
      <HelpPopper
        id="helpPopper"
        helpPopperContent={helpPopperContent}
        open={helpOpen}
        anchorEl={helpAnchorEl}
      />
    </Box>
  )
}

function ModelDescription({
  selectedModel,
  onActiveTraining,
  hoverFunc,
  leaveFunc,
}) {
  const { setSelectedModel, trainingStatus, resetContext } =
    React.useContext(TrainingContext)
  const navigate = useNavigate()
  const theme = useTheme()
  const [open, setOpen] = React.useState([])
  const [globalOpen, setGlobalOpen] = React.useState(false)
  let newOpen

  React.useEffect(() => {
    selectedModel !== undefined
      ? setOpen(new Array(selectedModel.fittings.length).fill(false))
      : setOpen([])
    setGlobalOpen(false)
  }, [selectedModel])

  const toggleAll = () => {
    setGlobalOpen(!globalOpen)
    newOpen = [...open]
    for (let i = 0; i < newOpen.length; i++) {
      newOpen[i] = !globalOpen
    }
    setOpen(newOpen)
  }

  if (!selectedModel) {
    // no model selected
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" align="center" color="lightgrey">
            Select a Model from the list to view details.
          </Typography>
        </CardContent>
      </Card>
    )
  } else {
    return (
      <Card sx={{ maxHeight: gridHeight, height: gridHeight }}>
        <CardContent
          sx={{ flexDirection: 'column', height: '100%', display: 'flex' }}
        >
          <CardHeader
            title={selectedModel.name}
            subheader={`Base Model: ${selectedModel.baseModelName}`}
            onMouseOver={(e) => {
              hoverFunc(
                e,
                "Here you see all relevant information of your model.\nOn the top, you can see the model's name, as well as which base model was used to create it.\nSince you can train every model multiple times, you can see all of its trained models listed below.\nTo start a new training with your selected model, simply click on 'Select training data'!"
              )
            }}
            onMouseLeave={leaveFunc}
          ></CardHeader>
          <Divider />
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h6" sx={{ pl: 2, pt: 2 }}>
                Trained models:
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              display="flex"
              sx={{
                pt: 2,
                justifyContent: 'flex-end',
              }}
            >
              <Button variant="text" endIcon={<Collapse />} onClick={toggleAll}>
                <Typography sx={{ color: theme.palette.primary.main }}>
                  {globalOpen ? 'Collapse all' : 'Expand all'}
                </Typography>
              </Button>
            </Grid>
          </Grid>
          {/* Adds a fitting for each fitting saved in the model */}
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {selectedModel.fittings.map((fitting, index) => (
              <RenderFitting
                fitting={fitting}
                key={`${fitting.id}-${index}`}
                hoverFunc={hoverFunc}
                leaveFunc={leaveFunc}
                index={index}
                open={open}
                setOpen={setOpen}
              ></RenderFitting>
            ))}
          </List>
          <CardActions>
            <Grid container justifyContent="center">
              <Button
                onClick={() => {
                  if (!trainingStatus) {
                    resetContext()
                    setSelectedModel(selectedModel)
                    navigate('/datasets')
                  } else {
                    onActiveTraining()
                  }
                }}
                className="select-training-data"
              >
                Select Training Data
              </Button>
            </Grid>
          </CardActions>
        </CardContent>
      </Card>
    )
  }
}

ModelDescription.propTypes = {
  selectedModel: PropTypes.any,
  onActiveTraining: PropTypes.any,
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
  fittingsLength: PropTypes.number,
}

/**
 * renders a fitting into a collapsable list
 * @param fitting the fitting to be rendered
 * @param hoverFunc Function that gets called when the mouse hovers over the component
 * @param leaveFunc Function that gets called when the mouse no longer hovers over the component
 * @param index todo upd javadoc
 * @param open
 * @param setOpen
 * @returns {JSX.Element}
 */
function RenderFitting({
  fitting,
  hoverFunc,
  leaveFunc,
  index,
  open,
  setOpen,
}) {
  const toggleOpen = () => {
    const newOpen = [...open]
    newOpen[index] = !open[index]
    setOpen(newOpen)
  }
  const theme = useTheme()
  return (
    <ListItem
      key={fitting.id}
      onMouseOver={(e) => {
        hoverFunc(
          e,
          'Here you can see which dataset was used to train this trained model, how long the model was trained (epochs), how big the data bundles were that were fed into the network (batch size), and how good it is (accuracy).'
        )
      }}
      onMouseLeave={leaveFunc}
    >
      <Box sx={{ width: 1 }}>
        <ListItemButton onClick={() => toggleOpen()}>
          {open[index] ? <ExpandLess /> : <ExpandMore />}
          <ListItemText
            primary={`Dataset: ${fitting.datasetName}`}
            secondary={`Trained model ID: ${fitting.id}`}
            sx={{ color: theme.palette.primary.main }}
          ></ListItemText>
        </ListItemButton>
        <Collapse
          in={open[index]}
          timeout="auto"
          mountOnEnter
          unmountOnExit
          orientation="vertical"
        >
          <List sx={{ pl: 4 }}>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.primary.main }}
                primary="Label: "
              ></ListItemText>
              {handleLabels(fitting.labels)}
            </ListItem>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.primary.main }}
                primary="Epochs: "
              ></ListItemText>
              {fitting.epochs}
            </ListItem>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.primary.main }}
                primary="Batch Size: "
              ></ListItemText>
              {fitting.batchSize}
            </ListItem>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.primary.main }}
                primary="Accuracy:"
              ></ListItemText>
              {fitting.accuracy}%
            </ListItem>
          </List>
        </Collapse>
        <Divider />
      </Box>
    </ListItem>
  )
}

RenderFitting.propTypes = {
  fitting: PropTypes.object.isRequired,
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
  index: PropTypes.number,
  open: PropTypes.array,
  setOpen: PropTypes.any,
}

function handleLabels(labelArray) {
  let labelText = ''
  for (let i = 0; i < labelArray.length - 1; i++) {
    labelText = labelText + camelToNaturalString(labelArray[i]) + ', '
  }
  labelText =
    labelText + camelToNaturalString(labelArray[labelArray.length - 1])
  return labelText
}

ModelsPage.propTypes = {
  modelList: PropTypes.array.isRequired,
  initSelectedIndex: PropTypes.number,
}

ModelsPage.defaultProps = {
  initSelectedIndex: -1,
}
