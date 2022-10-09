import React from 'react'
import {
  Box,
  Button,
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
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import SelectionList from '../components/shared/SelectionList'
import HelpPopper from '../components/shared/HelpPopper'
import HelpContext from '../context/HelpContext'
import TrainingContext from '../context/TrainingContext'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { camelToNaturalString } from '../utils'

const gridHeight = '80vh'
/**
 * Depicts a list of saved models and shows a description of the selected model on click
 * @param modelList list of models depicted
 * @param initSelectedIndex initially selected index of modelList
 */
export default function ModelsPage({ modelList, initSelectedIndex }) {
  const [selectedIndex, setSelectedIndex] = React.useState(initSelectedIndex)
  const [showDialog, setShowDialog] = React.useState(false)
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const training = React.useContext(TrainingContext)
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
        open={Boolean(helpAnchorEl)}
        anchorEl={helpAnchorEl}
      />
    </Box>
  )
}

ModelsPage.propTypes = {
  modelList: PropTypes.array.isRequired,
  initSelectedIndex: PropTypes.number,
}

ModelsPage.defaultProps = {
  initSelectedIndex: -1,
}

/**
 * Description of selectedModel, including previous trainings
 * @param selectedModel described model
 * @param onActiveTraining callback for attempting to initialize new training while another is still running
 * @param hoverFunc callback for hovering over description
 * @param leaveFunc callback for mouse pointer leaving description
 * @returns {JSX.Element}
 */
function ModelDescription({
  selectedModel,
  onActiveTraining,
  hoverFunc,
  leaveFunc,
}) {
  const [open, setOpen] = React.useState([])
  const [globalOpen, setGlobalOpen] = React.useState(false)
  const { setSelectedModel, trainingStatus, resetContext } =
    React.useContext(TrainingContext)
  const navigate = useNavigate()
  const theme = useTheme()

  React.useEffect(() => {
    selectedModel !== undefined
      ? setOpen(new Array(selectedModel.fittings.length).fill(false))
      : setOpen([])
    setGlobalOpen(false)
  }, [selectedModel])

  const toggleAll = () => {
    setGlobalOpen(!globalOpen)
    setOpen(new Array(open.length).fill(!globalOpen))
  }

  if (!selectedModel) {
    // no model selected
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" align="center" color="lightgrey">
            Select a model from the list to view details.
          </Typography>
        </CardContent>
      </Card>
    )
  } else {
    const handleClickSelectDataset = () => {
      if (!trainingStatus) {
        resetContext()
        setSelectedModel(selectedModel)
        navigate('/datasets')
      } else {
        onActiveTraining()
      }
    }
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
            {selectedModel.fittings.length === 0 ? null : (
              <Grid
                item
                xs={6}
                display="flex"
                sx={{
                  pt: 2,
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  variant="text"
                  endIcon={globalOpen ? <ExpandLess /> : <ExpandMore />}
                  onClick={toggleAll}
                >
                  <Typography sx={{ color: theme.palette.primary.main }}>
                    {globalOpen ? 'Collapse all' : 'Expand all'}
                  </Typography>
                </Button>
              </Grid>
            )}
          </Grid>
          {selectedModel.fittings.length === 0 ? (
            <Typography
              sx={{
                flexGrow: 1,
                color: theme.palette.text.secondary,
                m: 2,
                mt: 3,
                textAlign: 'center',
              }}
            >
              No trained models yet. Start a new training to create one!
            </Typography>
          ) : (
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
              {/* Adds a fitting for each fitting saved in the model */}
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
          )}
          <CardActions>
            <Grid container justifyContent="center">
              <Button
                onClick={handleClickSelectDataset}
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
  selectedModel: PropTypes.object,
  onActiveTraining: PropTypes.func,
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
  fittingsLength: PropTypes.number,
}

/**
 * renders a fitting into a collapsable list
 * @param fitting the fitting to be rendered
 * @param hoverFunc Function that gets called when the mouse hovers over the component
 * @param leaveFunc Function that gets called when the mouse no longer hovers over the component
 * @param index index of fitting
 * @param open array of boolean values representing which fittings are open
 * @param setOpen callback to signal change of open array
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
            primary={`Dataset: ${fitting.datasetName} #${fitting.datasetID}`}
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
              {camelToNaturalString(fitting.labels.join(', '))}
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
                primary="Accuracy (R²):"
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
  setOpen: PropTypes.func,
}
