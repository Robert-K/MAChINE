import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  ListItem,
  Divider,
} from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

export default function MoleculeInfo(props) {
  return (
    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
      {props.molecule.analyses.map((analysis, i, analyses) => {
        return (
          <React.Fragment
            key={`${JSON.stringify(analysis)} ${i.toString()} ${
              props.molecule.smiles
            }`}
          >
            {i === 0 ? null : <Divider></Divider>}
            <AnalysisInfo analysis={analysis}></AnalysisInfo>
          </React.Fragment>
        )
      })}
    </List>
  )
}

function AnalysisInfo(props) {
  const [expand, setExpand] = React.useState(false)
  const toggleExpand = () => {
    setExpand(!expand)
  }
  return (
    <React.Fragment key={JSON.stringify(props.analysis)}>
      <ListItemButton onClick={() => toggleExpand()}>
        {props.analysis.modelName}
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
                  primary={`${key}:${value.toString()}`}
                ></ListItemText>
              </ListItem>
            )
          })}
        </List>
      </Collapse>
    </React.Fragment>
  )
}

MoleculeInfo.propTypes = {
  molecule: PropTypes.object.isRequired,
}

AnalysisInfo.propTypes = {
  analysis: PropTypes.object.isRequired,
}
