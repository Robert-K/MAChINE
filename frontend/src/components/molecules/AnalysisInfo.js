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

export default function AnalysisInfo({ analysis }) {
  const [expand, setExpand] = React.useState(false)
  const toggleExpand = () => {
    setExpand(!expand)
  }

  return (
    <>
      <ListItemButton onClick={() => toggleExpand()}>
        <ListItemText
          primary={`${analysis.modelName}`}
          secondary={`Fitting: ${analysis.fittingID}`}
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
          {Object.entries(analysis.results).map(([key, value]) => {
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
    </>
  )
}

AnalysisInfo.propTypes = {
  analysis: PropTypes.object.isRequired,
}
