import React from 'react'
import { List, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import api from '../api'

export default function ModelConfigPage() {
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
  const [fingerprint, setfingerprint] = React.useState(128)
  const handlefingerprintChange = (event6) => {
    setfingerprint(event6.target.value)
  }
  const [label, setlabel] = React.useState('randomLabel.txt')
  const handlelabelChange = (event7) => {
    setlabel(event7.target.value)
  }
  /* const modelconfig = {
    epochs: '1000',
    batch_size: '64',
    verbose: '1',
    num_layers: '4',
    units_per_layer: '256',
    fingerprint_size: '128',
    label: 'randomLabel.txt',
  } */
  return (
    <div>
      <List>
        <TextField
          sx={{ m: 3 }}
          required
          id="epochs"
          label="Epochs"
          type="number"
          onChange={handleEpochsChange}
          defaultValue={epochs}
        />
        <TextField
          sx={{ m: 3 }}
          required
          id="batchsize"
          label="Batch Size"
          type="number"
          defaultValue={batchsize}
          onChange={handlebatchsizeChange}
        />
        <TextField
          sx={{ m: 3 }}
          required
          id="numLayers"
          label="Number of Layers"
          type="number"
          defaultValue={numlayers}
          onChange={handlenumlayersChange}
        />
        <TextField
          sx={{ m: 3 }}
          required
          id="unitsPerLayer"
          label="Units per Layer"
          type="number"
          defaultValue={unitsperlayer}
          onChange={handleunitsperlayerChange}
        />
        <TextField
          sx={{ m: 3 }}
          required
          id="fingerprintSize"
          label="Fingerprint Size"
          type="number"
          defaultValue={fingerprint}
          onChange={handlefingerprintChange}
        />
        <TextField
          sx={{ m: 3 }}
          required
          id="label"
          label="label"
          defaultValue={label}
          onChange={handlelabelChange}
        />
        <Button
          variant="contained"
          sx={{ m: 3 }}
          disabled={
            // these ranges of values where chosen *randomly* and have to be adjusted at some point
            // this does not work for some reason
            !(
              epochs >= 100 &&
              epochs <= 10000 &&
              batchsize >= 50 &&
              batchsize <= 100 &&
              numlayers >= 2 &&
              numlayers <= 20 &&
              unitsperlayer >= 50 &&
              unitsperlayer <= 1024 &&
              fingerprint >= 20 &&
              fingerprint <= 512
            )
          }
          onClick={() =>
            api.createNewModelConfig({
              epochs: { epochs },
              batch_size: { batchsize },
              num_layers: { numlayers },
              units_per_layer: { unitsperlayer },
              fingerprint_size: { fingerprint },
              label: { label },
            })
          }
        >
          Create Model Configuration
        </Button>
      </List>
    </div>
  )
}
