/**
 * AUTHOR'S NOTE: THIS MODELS PAGE IS FOR TESTING THE BASE MODEL SELECTION ONLY.
 * DELETE FILE WHEN MERGING WITH MAIN BRANCH.
 */

import React from 'react'
import { Card, CardContent, CardActions, Grid, Box } from '@mui/material'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
export default function Models() {
  return (
    <Box sx={{ m: 5 }}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <Card>
            <CardContent>Hello, this is a placeholder</CardContent>
            <CardActions>
              <Button component={Link} to="/base-models" variant="contained">
                Add a model!
              </Button>
            </CardActions>
          </Card>
          <Card sx={{ mt: 5 }}>
            <CardContent>Hello, this is a placeholder</CardContent>
            <CardActions>
              <Button component={Link} to="/datasets" variant="contained">
                Select a Dataset!
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
