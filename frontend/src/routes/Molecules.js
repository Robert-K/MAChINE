import React from 'react'
import { Card, CardContent, Grid, Box, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import MoleculeSelection from '../components/MoleculeSelection'

export default function Molecules() {
  return (
    <Box sx={{ m: 5 }}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          {MoleculeSelection()}
        </Grid>
        <Grid item md={9}>
          {MoleculeView()}
        </Grid>
      </Grid>
    </Box>
  )
}

function MoleculeView() {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{ background: 'black', width: '100%', height: '600px', mb: 2 }}
        ></Box>
        <Grid container spacing={2}>
          <Grid item>
            <TextField label="Name"></TextField>
          </Grid>
          <Grid item style={{ flex: 1 }}>
            <Button size="large" variant="outlined" sx={{ minHeight: 55 }}>
              Save
            </Button>
          </Grid>
          <Grid item>
            <Button size="large" variant="outlined" sx={{ minHeight: 55 }}>
              Analyze!
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
