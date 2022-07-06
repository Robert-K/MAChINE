import React from 'react'
import { Box, Card, CardContent, Divider, Grid, List } from '@mui/material'
import Button from '@mui/material/Button'
import { useLocation } from 'react-router-dom'

export default function TrainingPage() {
  const { state } = useLocation()
  const { selectedModel, selectedDatasetID, selectedLabels } = state
  console.log(selectedModel, selectedDatasetID, selectedLabels)
  return (
    <List>
      <List item>
        <Grid container>
          <Grid item xs sx={{ maxWidth: 400 }}>
            <Box>
              <Card sx={{ minWidth: 250, m: 6 }}>
                <CardContent sx={{ fontSize: 20 }}>Modell Details</CardContent>
              </Card>
              <Card sx={{ minWidth: 250, m: 6 }}>
                <CardContent sx={{ fontSize: 20 }}>Dataset Details</CardContent>
              </Card>
            </Box>
          </Grid>
          <Divider
            oriantation="vertical"
            variant="middle"
            flexitem
            sx={{ border: 'black' }}
          ></Divider>
          <Grid item xs>
            <Box sx={{ m: 5, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 600,
                  height: 500,
                  background: 'black',
                }}
              ></Box>
            </Box>
          </Grid>
        </Grid>
      </List>
      <List item>
        <Grid Item>
          <Box sx={{ display: 'flex', justifyContent: 'right' }}>
            <Box>
              <Button>Start/Stopp</Button>
              <Button>Continue to Molecule</Button>
            </Box>
          </Box>
        </Grid>
      </List>
    </List>
  )
}
