import React from 'react'
import PropTypes from 'prop-types'
// import Typography from '@mui/material/Typography'
// import Box from '@mui/material/Box'
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'

function BaseModelInfo(props) {
  return (
    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
      <Button fullWidth variant="contained">
        Configure this model
      </Button>
      {props.baseModel.compatibleDatasets.map((dataset, i, datasets) => {
        return (
          <React.Fragment
            key={`${JSON.stringify(dataset)} ${i.toString()} ${
              props.baseModel.id
            }`}
          >
            {i === 0 ? null : <Divider></Divider>}
            <DatasetInfo dataset={dataset}></DatasetInfo>
          </React.Fragment>
        )
      })}
    </List>
  )
}

function DatasetInfo(props) {
  const [expand, setExpand] = React.useState(false)
  const toggleExpand = () => {
    setExpand(!expand)
  }

  return (
    <React.Fragment key={props.dataset.datasetID}>
      <ListItemButton onClick={() => toggleExpand()}>
        {props.dataset.name}
        {expand ? <ExpandLess /> : <ExpandMore />}{' '}
      </ListItemButton>
      <Collapse
        in={expand}
        timeout="auto"
        mountOnEnter
        unmountOnExit
        orientation="vertical"
      >
        <Collapse
          in={expand}
          timeout="auto"
          mountOnEnter
          unmountOnExit
          orientation="horizontal"
        >
          <List component="div" dense>
            {props.dataset.labelDescriptors.map((labelDescriptor, i, value) => {
              console.log(props.dataset.labelDescriptors)
              return (
                <ListItem
                  sx={{ pl: 4 }}
                  key={`${i.toString()} ${labelDescriptor}`}
                >
                  <ListItemText primary={labelDescriptor}></ListItemText>
                </ListItem>
              )
            })}
          </List>
        </Collapse>
      </Collapse>
    </React.Fragment>

    /*
    <Box>
      {props.baseModel.compatibleDatasets.map((dataset) => (
        <Box key={dataset.datasetID} marginBottom={1}>
          <Typography variant="h6" component="h4">
            {dataset.name}
          </Typography>
          <Typography variant="subtitle1" component="h4">
            Number of entries: {dataset.size}
          </Typography>
        </Box>
      ))}
    </Box>
     */
  )
}

BaseModelInfo.propTypes = {
  baseModel: PropTypes.object,
  compatibleDatasets: PropTypes.object,
  dataset: PropTypes.object,
}

DatasetInfo.propTypes = {
  dataset: PropTypes.object,
}

export default BaseModelInfo
