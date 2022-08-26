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
import api from '../api'
import TrainingContext from '../context/TrainingContext'
import UserContext from '../context/UserContext'

const gridHeight = '80vh'
/**
 * Depicts a list of saved models and shows a description of the selected model on click
 */
export default function ModelsPage() {
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [modelList, setModelList] = React.useState([])
  const [showDialog, setShowDialog] = React.useState(false)
  const training = React.useContext(TrainingContext)
  const user = React.useContext(UserContext)

  React.useEffect(() => {
    api.getModelList().then((models) => setModelList(models))
  }, [user])

  const updateSelection = (index) => {
    setSelectedIndex(index)
  }

  const navigate = useNavigate()

  return (
    <Box sx={{ m: 5 }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        columnSpacing={2}
      >
        <Grid item xs={3}>
          <SelectionList
            updateFunc={updateSelection}
            elements={modelList}
            elementType="model"
            usePopper={false}
            addFunc={() => navigate('/base-models')}
            height={gridHeight}
          ></SelectionList>
        </Grid>
        <Grid item xs={9}>
          <ModelDescription />
        </Grid>
      </Grid>
    </Box>
  )

  function ModelDescription() {
    if (selectedIndex < 0) {
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
      const selectedModel = modelList[selectedIndex]

      const handleCloseDialog = () => {
        setShowDialog(false)
      }

      const abortTraining = () => {
        training.setTrainingStatus(false)
        // TODO: Send abort training command to backend
        setShowDialog(false)
        training.setSelectedModel(selectedModel)
        navigate('/datasets')
      }

      return (
        <Card sx={{ maxHeight: gridHeight, height: gridHeight }}>
          <CardContent
            sx={{ flexDirection: 'column', height: '100%', display: 'flex' }}
          >
            <CardHeader
              title={selectedModel.name}
              subheader={`Base Model: ${selectedModel.baseModel}`}
            ></CardHeader>
            <Divider />
            <Typography variant="h6" sx={{ pl: 2, pt: 2 }}>
              Trained fittings:
            </Typography>
            {/* Adds a fitting for each fitting saved in the model */}
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
              {selectedModel.fittings.map((fitting) => (
                <RenderFitting
                  fitting={fitting}
                  key={fitting.id}
                ></RenderFitting>
              ))}
            </List>
            <CardActions>
              <Grid container justifyContent="center">
                <Button
                  onClick={() => {
                    if (!training.trainingStatus) {
                      training.setSelectedModel(selectedModel)
                      navigate('/datasets')
                    } else {
                      setShowDialog(true)
                    }
                  }}
                >
                  Select Training Data
                </Button>
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
                      To start a new training, you have to abort the current
                      training
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={abortTraining}>Continue</Button>
                  </DialogActions>
                </Dialog>
              </Grid>
            </CardActions>
          </CardContent>
        </Card>
      )
    }
  }
}

/**
 * renders a fitting into a collapsable list
 * @param fitting the fitting to be rendered
 * @returns {JSX.Element}
 */
function RenderFitting({ fitting }) {
  const [open, setOpen] = React.useState(false)
  const toggleOpen = () => {
    setOpen(!open)
  }
  const theme = useTheme()
  return (
    <ListItem key={fitting.id}>
      <Box sx={{ width: 1 }}>
        <ListItemButton onClick={() => toggleOpen()}>
          {open ? <ExpandLess /> : <ExpandMore />}
          <ListItemText
            primary={`Dataset ID: ${fitting.datasetID}`}
            secondary={`Fitting ID: ${fitting.id}`}
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
}
