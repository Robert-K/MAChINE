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
import UserContext from '../context/UserContext'
import HelpPopper from '../components/shared/HelpPopper'
import HelpContext from '../context/HelpContext'

const gridHeight = '80vh'
/**
 * Depicts a list of saved models and shows a description of the selected model on click
 */
export default function ModelsPage({ modelList }) {
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [showDialog, setShowDialog] = React.useState(false)
  const [creatingModel, setCreatingModel] = React.useState(false)
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const training = React.useContext(TrainingContext)

  const navigate = useNavigate()
  const [helpPopperContent, setHelpPopperContent] = React.useState('')

  const user = React.useContext(UserContext)
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
              "This is a list of all models you have created so far. Click on any one of them to get more information about it, or click on 'Add a model' to add a new one to the list!"
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
            selectedModel={modelList.at(selectedIndex)}
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
        onClose={handleHelpPopperClose}
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

  if (!selectedModel) {
    // no model selected
    return (
      <Card>
        <CardContent>
          <Typography align="center" color="lightgrey">
            Select a Model.
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
            subheader={`Base Model: ${selectedModel.baseModelID}`}
            onMouseOver={(e) => {
              hoverFunc(
                e,
                "Here you see all relevant information of your model. On the top, you can see the model's name, as well as which base model was used to create it. Since you can train every model multiple times, you can see all of its trained models listed below, too. To start a new training with your selected model, simply click on 'Select training data'!"
              )
            }}
            onMouseLeave={leaveFunc}
          ></CardHeader>
          <Divider />
          <Typography variant="h6" sx={{ pl: 2, pt: 2 }}>
            Trained models:
          </Typography>
          {/* Adds a fitting for each fitting saved in the model */}
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {selectedModel.fittings.map((fitting, index) => (
              <RenderFitting
                fitting={fitting}
                key={`${fitting.id}-${index}`}
                hoverFunc={hoverFunc}
                leaveFunc={leaveFunc}
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
}
/**
 * renders a fitting into a collapsable list
 * @param fitting the fitting to be rendered
 * @returns {JSX.Element}
 */
function RenderFitting({ fitting, hoverFunc, leaveFunc }) {
  const [open, setOpen] = React.useState(false)
  const toggleOpen = () => {
    setOpen(!open)
  }
  const theme = useTheme()
  return (
    <ListItem
      key={fitting.id}
      onMouseOver={(e) => {
        hoverFunc(
          e,
          'Here you can see which dataset was used to train this trained model, how long the model was trained (epochs), how big the data bundles were that were fed into the network (batch size), and how good the it is (accuracy).'
        )
      }}
      onMouseLeave={leaveFunc}
    >
      <Box sx={{ width: 1 }}>
        <ListItemButton onClick={() => toggleOpen()}>
          {open ? <ExpandLess /> : <ExpandMore />}
          <ListItemText
            primary={`Dataset ID: ${fitting.datasetID}`}
            secondary={`Trained model ID: ${fitting.id}`}
            sx={{ color: theme.palette.primary.main }}
          ></ListItemText>
        </ListItemButton>
        <Collapse
          in={open}
          timeout="auto"
          mountOnEnter
          unmountOnExit
          orientation="vertical"
        >
          <List sx={{ pl: 4 }}>
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
}

ModelsPage.propTypes = {
  modelList: PropTypes.array.isRequired,
}
