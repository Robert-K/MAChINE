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
} from '@mui/material'
import Button from '@mui/material/Button'
import ModelConfig from '../internal/ModelConfig'
import SelectionList from '../components/SelectionList'
import CollapsibleMenu from '../components/testToggleState'
// import PropTypes from 'prop-types'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PropTypes from 'prop-types'

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = React.useState('')

  const models = [
    new ModelConfig('1', 'Test Model1', '13', [3, 4, 5], []),
    new ModelConfig('2', 'Test Model2', '14', [5, 4, 5], []),
  ]
  models[0].addFitting('1a', 9, 70)
  models[0].addFitting('1b', 10, 72)
  models[1].addFitting('2a', 11, 75)
  models[1].addFitting('2b', 12, 78)

  const updateSelection = (index) => {
    setSelectedModel(index)
  }

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
            ></SelectionList>
          }
        </Grid>
        <Grid item md={9}>
          {ModelDescription()}
          <CollapsibleMenu></CollapsibleMenu>
        </Grid>
      </Grid>
    </Box>
  )

  function ModelDescription() {
    function getCurrentIndex() {
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
      return (
        <Card>
          <CardContent>
            <CardHeader>{models[getCurrentIndex()].name}</CardHeader>
            <Typography>
              Base Model: {models[getCurrentIndex()].baseModel}
            </Typography>
            <Typography>Trained on: </Typography>
            {renderFittings(models[getCurrentIndex()].fittings)}
          </CardContent>
          <CardActions>
            <Grid container justifyContent="center">
              <Button>Select Training Data</Button>
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
      <style>{`
          .listKey {
            font-weight: bold;
            color: red;
          }
        `}</style>
      {fittings.map((fitting) => (
        <RenderFitting fitting={fitting} key={fitting.id}></RenderFitting>
      ))}
    </List>
  )
}

function RenderFitting(props) {
  const [open, setOpen] = React.useState(false)
  const toggleOpen = () => {
    setOpen(!open)
  }
  return (
    <ListItem key={props.fitting.id}>
      <ListItemButton onClick={() => toggleOpen()}>
        {open ? <ExpandLess /> : <ExpandMore />}
        <ListItemText
          className="listKey"
          primary={props.fitting.datasetID}
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
            <ListItemText className="listKey" primary="Epochs: "></ListItemText>
            {props.fitting.epochs}
          </ListItem>
          <ListItem>
            <ListItemText
              className="listKey"
              primary="Accuracy:"
            ></ListItemText>
            {props.fitting.accuracy}%
          </ListItem>
        </List>
      </Collapse>
      <Divider />
    </ListItem>
  )
}

RenderFitting.propTypes = {
  fitting: PropTypes.object.isRequired,
}
