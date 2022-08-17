import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  ListItem,
  TextField,
  Typography,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

export default function TrainingPage() {
  const { state } = useLocation()
  const { selectedModel, selectedDatasetID, selectedLabels } = state
  console.log(selectedModel, selectedDatasetID, selectedLabels)

  const [epochs, setEpochs] = React.useState(1000)
  const handleEpochsChange = (event) => {
    setEpochs(event.target.value)
  }
  const [batchsize, setBatchSize] = React.useState(64)
  const handlebatchsizeChange = (event2) => {
    setBatchSize(event2.target.value)
  }

  const navigate = useNavigate()

  return (
    <Grid container>
      <Grid xs={6}>
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
        <Card sx={{ m: 3 }}>
          <CardContent>
            <Typography sx={{ fontSize: 20 }}>Modell Details</Typography>
            <Typography>Name: {selectedModel.name}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ m: 3 }}>
          <CardContent>
            <Typography sx={{ fontSize: 20 }}>Dataset Details</Typography>
            <Typography>id: {selectedDatasetID}</Typography>
            <Typography>Label:</Typography>
            {selectedLabels.map((label) => (
              <ListItem key={label}>{label}</ListItem>
            ))}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ m: 2, background: 'black', height: 400 }}></Box>
        <Button variant="outlined" sx={{ m: 2 }}>
          Start/Stopp
        </Button>
        <Button
          variant="outlined"
          sx={{ m: 2 }}
          onClick={() => navigate('/molecules')}
        >
          Continue to Molecules
        </Button>
      </Grid>
    </Grid>
  )
}
