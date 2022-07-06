import React from 'react'
import { Container, Grid } from '@mui/material'
import DatasetCard from '../components/DatasetCard'
import Dataset from '../internal/Dataset'

export default function DatasetPage() {
  return (
    <Container>
      <Grid container spacing={5} sx={{ mt: 1, mb: 5 }}>
        <DatasetCard dataset={dataset1} />
        <DatasetCard dataset={dataset2} />
        <DatasetCard dataset={dataset3} />
        <DatasetCard dataset={dataset2} />
        <DatasetCard dataset={dataset1} />
        <DatasetCard dataset={dataset2} />
        <DatasetCard dataset={dataset3} />
      </Grid>
    </Container>
  )
}

const dataset1 = new Dataset('dataset1', 1, 200, [
  'Attribute1a',
  'Attribute1b',
  'Attribute1c',
])

const dataset2 = new Dataset('dataset2', 2, 500, ['Attribute2a', 'Attribute2b'])

const dataset3 = new Dataset('dataset3', 3, 1000, [
  'Attribute3a',
  'Attribute3b',
  'Attribute3c',
  'Attribute3d',
  'Attribute3e',
])
