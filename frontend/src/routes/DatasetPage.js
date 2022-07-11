import React from 'react'
import { Container, Grid } from '@mui/material'
import DatasetCard from '../components/DatasetCard'
import Dataset from '../internal/Dataset'
import PropTypes from 'prop-types'
import DetailsPopper from '../components/DetailsPopper'
import DatasetInfo from '../components/DatasetInfo'

export default function DatasetPage() {
  /* TODO: Buncha duplicated code from MoleculeSelection. Might want to fix that at some point */
  const [open, setOpen] = React.useState(false)
  const [waited, setWaited] = React.useState(false)
  const [content, setContent] = React.useState(<h1>Placeholder</h1>)
  const [anchor, setAnchor] = React.useState(null)

  const handlePopper = (target, content, show) => {
    setContent(content)
    setAnchor(target)
    setOpen(show)
    setWaited(false)
    if (show) {
      setTimeout(() => {
        setWaited(true)
      }, 150)
    }
  }

  const handleListItemClick = (event, index) => {
    // setSelectedIndex(index)
    handlePopper(null, <div />, false)
  }

  return (
    <Container>
      <Grid container spacing={4} sx={{ mt: 1, mb: 5 }}>
        {datasetArray.map((dataset) => (
          <DatasetCard
            dataset={dataset}
            key={dataset.datasetID}
            doubleClickFunc={(event) => {
              handleListItemClick(event, dataset.name)
            }}
            clickFunc={(event) => {
              handlePopper(
                event.currentTarget,
                <DatasetInfo
                  dataset={dataset}
                  key={dataset.datasetID}
                ></DatasetInfo>,
                event.currentTarget !== anchor || !open
              )
            }}
          />
        ))}
        <DetailsPopper
          anchor={anchor}
          open={open}
          content={content}
          waited={waited}
        />
      </Grid>
    </Container>
  )
}

DatasetPage.propTypes = {
  dataset: PropTypes.array,
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

const datasetArray = [dataset1, dataset2, dataset3, dataset2, dataset3]
