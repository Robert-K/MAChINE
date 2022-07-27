import React from 'react'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
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
import ModelConfig from '../internal/ModelConfig'
import SelectionList from '../components/SelectionList'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'

/**
 * Depicts a list of saved models and shows a description of the selected model on click
 */
export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = React.useState('')

  // Model storage, TODO: to be replaced by data from backend, probably needs to be relocated
  const models = [
    new ModelConfig('1', 'Test Model1', '13', [3, 4, 5], []),
    new ModelConfig('2', 'Test Model2', '14', [5, 4, 5], []),
  ]
  models[0].addFitting('dataset1a', 9, 20, 70)
  models[0].addFitting('dataset1b', 10, 20, 72)
  models[1].addFitting('dataset2a', 11, 30, 75)
  models[1].addFitting('dataset2b', 12, 30, 78)

  const updateSelection = (model, index) => {
    setSelectedModel(index)
  }

  const navigate = useNavigate()

  return (
    <Box sx={{ m: 5 }}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          {
            <SelectionList
              updateFunc={updateSelection}
              elements={models}
              elementType="model"
              usePopper={false}
              addFunc={() => navigate('/base-models')}
            ></SelectionList>
          }
        </Grid>
        <Grid item md={9}>
          {ModelDescription()}
        </Grid>
      </Grid>
    </Box>
  )

  function ModelDescription() {
    function getCurrentIndex() {
      // TODO: Oof, please use the element or index from updateFunc instead of this
      // finds selected model in model storage
      return models.findIndex((element) => element.name === selectedModel)
    }

    if (getCurrentIndex() < 0) {
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
      const currentModel = models[getCurrentIndex()]
      return (
        <Card>
          <CardContent>
            <CardHeader>{currentModel.name}</CardHeader>
            <Typography>Base Model: {currentModel.baseModel}</Typography>
            <Typography>Trained on: </Typography>
            {renderFittings(currentModel.fittings)}
          </CardContent>
          <CardActions>
            <Grid container justifyContent="center">
              <Button component={Link} to="/datasets">
                Select Training Data
              </Button>
            </Grid>
          </CardActions>
        </Card>
      )
    }
  }
}

function renderFittings(fittings) {
  return (
    <List>
      {fittings.map((fitting) => (
        <RenderFitting fitting={fitting} key={fitting.id}></RenderFitting>
      ))}
    </List>
  )
}

/**
 * renders a fitting into a collapsable list
 * @param props contains the fitting to be rendered
 * @returns {JSX.Element}
 */
function RenderFitting(props) {
  const [open, setOpen] = React.useState(false)
  const toggleOpen = () => {
    setOpen(!open)
  }
  const theme = useTheme()
  return (
    <ListItem key={props.fitting.id}>
      <Box sx={{ width: 1 }}>
        <ListItemButton onClick={() => toggleOpen()}>
          {open ? <ExpandLess /> : <ExpandMore />}
          <ListItemText
            primary={props.fitting.datasetID}
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
              {props.fitting.epochs}
            </ListItem>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.primary.main }}
                primary="Batch Size: "
              ></ListItemText>
              {props.fitting.batchSize}
            </ListItem>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.primary.main }}
                primary="Accuracy:"
              ></ListItemText>
              {props.fitting.accuracy}%
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
