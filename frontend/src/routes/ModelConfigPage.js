import React from 'react'
import Layer from '../internal/Layer'
import LayerVisual from '../components/LayerVisual'
// import { useLocation } from 'react-router-dom'
// import ModelVisual from '../components/ModelVisual'
import Grid from '@mui/material/Grid'
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

export default function ModelConfigPage() {
  // const { state } = useLocation()
  // const baseModel = state.baseModel
  /*
  const [epochs, setEpochs] = React.useState(1000)
  const handleEpochsChange = (event) => {
    setEpochs(event.target.value)
  }
  const [batchsize, setBatchSize] = React.useState(64)
  const handlebatchsizeChange = (event2) => {
    setBatchSize(event2.target.value)
  }
  const [numlayers, setnumlayers] = React.useState(4)
  const handlenumlayersChange = (event4) => {
    setnumlayers(event4.target.value)
  }
  const [unitsperlayer, setunitsperlayer] = React.useState(256)
  const handleunitsperlayerChange = (event5) => {
    setunitsperlayer(event5.target.value)
  }
  const [label, setlabel] = React.useState('randomLabel.txt')
  const handlelabelChange = (event7) => {
    setlabel(event7.target.value)
  }

  const [answer, setanswer] = React.useState('Controlled')
  */

  const testLayer = new Layer('Dense', 4)

  const LossFunction = [
    'Mean Squared Error',
    'Mean Absolute Error',
    'Huber Loss',
    'Binary Cross Entropy',
  ]
  const Optimizers = ['Adam', 'Adamax', 'Stochastic Gradient Descent']

  /* const modelconfig = {
    epochs: '1000',
    batch_size: '64',
    verbose: '1',
    num_layers: '4',
    units_per_layer: '256',
    fingerprint_size: '128',
    label: 'randomLabel.txt',
  } */
  const [expand, setExpand] = React.useState(false)
  const toggleExpand = () => {
    setExpand(!expand)
  }

  return (
    <div>
      {/* <ModelVisual model={baseModel} /> */}
      <Grid container>
        <Grid item xs={8}>
          {/* <LayerVisual layer={testLayer} /> */}
        </Grid>
        <Grid item xs={4}>
          <ListItemButton onClick={toggleExpand}>
            Loss-Function
            {expand ? <ExpandLess /> : <ExpandMore />}{' '}
          </ListItemButton>
          <Collapse
            in={expand}
            timeout="auto"
            mountOnEnter
            unmountOnExit
            orientation="vertical"
          >
            <List component="div" dense>
              {LossFunction.map((lossFunction) => {
                return (
                  <ListItem sx={{ pl: 4 }} key={lossFunction}>
                    <ListItemText>{lossFunction}</ListItemText>
                  </ListItem>
                )
              })}
            </List>
          </Collapse>
          <ListItemButton onClick={() => toggleExpand()}>
            Optimizer
            {expand ? <ExpandLess /> : <ExpandMore />}{' '}
          </ListItemButton>
          <Collapse
            in={expand}
            timeout="auto"
            mountOnEnter
            unmountOnExit
            orientation="vertical"
          >
            <List component="div" dense>
              {Optimizers.map((optimizer) => {
                return (
                  <ListItem sx={{ pl: 4 }} key={optimizer}>
                    <ListItemText>{optimizer}</ListItemText>
                  </ListItem>
                )
              })}
            </List>
          </Collapse>
        </Grid>
      </Grid>
    </div>
  )
}
