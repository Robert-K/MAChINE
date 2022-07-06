import React from 'react'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import ModelConfig from '../internal/ModelConfig'
import SelectionList from '../components/SelectionList'
import CollapsibleMenu from '../components/testToggleState'

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = React.useState('')

  const models = [
    new ModelConfig('Test Model1', '13', [3, 4, 5]),
    new ModelConfig('Test Model2', '14', [5, 4, 5]),
  ]
  models[0].addFitting('dataset1a', 9, 70)
  models[0].addFitting('dataset1b', 10, 72)
  models[1].addFitting('dataset2a', 11, 75)
  models[1].addFitting('dataset2b', 12, 78)

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
            {models[getCurrentIndex()].fittings.map((fitting) => (
              <React.Fragment key={fitting.toString()}>
                {fitting.render}
              </React.Fragment>
            ))}
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
