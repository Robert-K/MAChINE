import React from 'react'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  List,
  Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import ModelConfig from '../internal/ModelConfig'

export default function Models() {
  // TODO: enable child accessing state
  // const [selectedModelIndex, setSelectedModelID] = React.useState(0)
  return (
    <Box sx={{ m: 5 }}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          {ModelSelection()}
        </Grid>
        <Grid item md={9}>
          {ModelDescription()}
        </Grid>
      </Grid>
    </Box>
  )
}

function ModelDescription() {
  const models = [
    new ModelConfig('Test Model1', '13', [3, 4, 5]),
    new ModelConfig('Test Model2', '14', [5, 4, 5]),
  ]
  models[0].addFitting('dataset1a', 9, 70)
  models[0].addFitting('dataset1b', 10, 72)
  models[1].addFitting('dataset2a', 11, 75)
  models[1].addFitting('dataset2b', 12, 78)
  // const selectedModelIndex = React.useState(0)
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{models[0].name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography>Base Model: {models[0].baseModel}</Typography>
        <Typography>Trained on: </Typography>
        <List>{models[0].fittings.map((fitting) => fitting.render())}</List>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="center">
          <Button>Select Training Data</Button>
        </Grid>
      </CardActions>
    </Card>
  )
}

function ModelSelection() {
  return undefined
}
