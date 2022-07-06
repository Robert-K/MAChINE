/**
 * This page is reached when clicking 'analyze' on a molecule.
 */

import React from 'react'
import { Container } from '@mui/material'
import Grid from '@mui/material/Grid'
import FittingCard from '../components/FittingCard'

export default function TrainedModels() {
  return (
    <Container>
      <Grid container spacing={4} marginTop={1} marginBottom={5}>
        {fittingArray.map((fitting) => (
          <FittingCard
            fitting={fitting}
            key={fitting.id}
            clickFunc={(event) => console.log('Clicking works')}
          />
        ))}
      </Grid>
    </Container>
  )
}

const fittingArray = []
