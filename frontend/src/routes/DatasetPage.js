import React from 'react'
import { Box } from '@mui/material'
import api from '../api'
import DatasetCard from '../components/datasets/DatasetCard'
import DatasetInfo from '../components/datasets/DatasetInfo'
import HelpPopper from '../components/shared/HelpPopper'
import DetailsPopper from '../components/shared/DetailsPopper'
import HelpContext from '../context/HelpContext'
import PropTypes from 'prop-types'

/**
 * Selection component for datasets
 * @returns {JSX.Element}
 */
export default function DatasetPage() {
  const [datasets, setDatasets] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [content, setContent] = React.useState(<h1>Placeholder</h1>)
  const [anchor, setAnchor] = React.useState(null)
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)

  React.useEffect(() => {
    api.getDatasets().then((datasetList) => {
      setDatasets(datasetList)
    })
  }, [])

  const handlePopper = (target, content, show) => {
    setContent(content)
    setAnchor(target)
    setOpen(show)
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

  const datasetCardClick = (event, dataset) => {
    handlePopper(
      event.currentTarget,
      <DatasetInfo dataset={dataset} key={dataset.datasetID} />,
      event.currentTarget !== anchor || !open
    )
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
            clickFunc={(event) => datasetCardClick(event, dataset)}
            hoverFunc={(e) => {
              handleHelpPopperOpen(
                e,
                "Click to select the dataset you want to train on. \n After choosing your label(s), it's time to start training!"
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
          open={Boolean(helpAnchorEl)}
          anchorEl={helpAnchorEl}
          onClose={handleHelpPopperClose}
        />
      </Box>
    </Box>
  )
}

DatasetPage.propTypes = {
  datasets: PropTypes.array,
}
