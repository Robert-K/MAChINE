import React from 'react'
import { Box } from '@mui/material'
import DatasetCard from '../components/datasets/DatasetCard'
import PropTypes from 'prop-types'
import DetailsPopper from '../components/shared/DetailsPopper'
import DatasetInfo from '../components/datasets/DatasetInfo'

import api from '../api'
import HelpContext from '../context/HelpContext'
import HelpPopper from '../components/shared/HelpPopper'

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
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)

  const handlePopper = (target, content, show) => {
    setContent(content)
    setAnchor(target)
    setOpen(show)
  }

  const handleListItemClick = (event, index) => {
    // setSelectedIndex(index)
    handlePopper(null, <div />, false)
  }

  const handleHelpPopperOpen = (event, content) => {
    if (help.helpMode) {
      setHelpAnchorEl(event.currentTarget)
      setHelpPopperContent(content)
    }
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
  }

  const helpOpen = Boolean(helpAnchorEl)

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
            hoverFunc={(e) => {
              handleHelpPopperOpen(
                e,
                "Click to select the dataset you want to train on. \n After confirming your choice, it's time to start training!"
              )
            }}
            leaveFunc={handleHelpPopperClose}
          />
        ))}
        <DetailsPopper
          anchor={anchor}
          open={open}
          content={content}
          popperWidth={200}
        />

        <HelpPopper
          id="helpPopper"
          helpPopperContent={helpPopperContent}
          open={helpOpen}
          anchorEl={helpAnchorEl}
          onClose={handleHelpPopperClose}
        />
      </Box>
    </Box>
  )
}

DatasetPage.propTypes = {
  dataset: PropTypes.array,
}
