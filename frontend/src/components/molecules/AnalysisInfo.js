import React from 'react'
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PropTypes from 'prop-types'

function AnalysisInfo(props) {
  const [expand, setExpand] = React.useState(false)
  const toggleExpand = () => {
    setExpand(!expand)
  }
  return (
    <React.Fragment key={JSON.stringify(props.analysis)}>
      <ListItemButton onClick={() => toggleExpand()}>
        <ListItemText
          primary={`${props.analysis.modelName}:`}
          secondary={`Fitting: ${props.analysis.fittingID}`}
        ></ListItemText>
        {expand ? <ExpandLess /> : <ExpandMore />}{' '}
      </ListItemButton>
      <Collapse
        in={expand}
        timeout="auto"
        mountOnEnter
        unmountOnExit
        orientation="vertical"
      >
        <List component="div" dense>
          {Object.entries(props.analysis.results).map(([key, value]) => {
            return (
              <ListItem sx={{ pl: 4 }} key={key}>
                <ListItemText
                  primary={`${key}: ${value.toString()}`}
                ></ListItemText>
              </ListItem>
            )
          })}
        </List>
      </Collapse>
    </React.Fragment>
  )
}

AnalysisInfo.propTypes = {
  analysis: PropTypes.object.isRequired,
}

export default AnalysisInfo
