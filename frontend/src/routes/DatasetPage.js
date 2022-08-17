import React from 'react'
import { Box } from '@mui/material'
import DatasetCard from '../components/datasets/DatasetCard'
import PropTypes from 'prop-types'
import DetailsPopper from '../components/shared/DetailsPopper'
import DatasetInfo from '../components/datasets/DatasetInfo'

import api from '../api'

export default function DatasetPage() {
  const [datasets, setDatasets] = React.useState([])

  React.useEffect(() => {
    api.getDatasets().then((datasetList) => {
      setDatasets(datasetList)
      console.log(datasets)
    })
  }, [])

  const [open, setOpen] = React.useState(false)
  const [content, setContent] = React.useState(<h1>Placeholder</h1>)
  const [anchor, setAnchor] = React.useState(null)

  const handlePopper = (target, content, show) => {
    setContent(content)
    setAnchor(target)
    setOpen(show)
  }

  const handleListItemClick = (event, index) => {
    // setSelectedIndex(index)
    handlePopper(null, <div />, false)
  }

  return (
    <Box sx={{ m: 5 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 5,
        }}
      >
        {datasets.map((dataset) => (
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
          popperWidth={200}
        />
      </Box>
    </Box>
  )
}

DatasetPage.propTypes = {
  dataset: PropTypes.array,
}
