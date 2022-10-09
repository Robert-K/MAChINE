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
import { camelToNaturalString } from '../../utils'

/**
 * This component is used on MoleculesPage in the DetailsPopper (after clicking on the i-icon of a molecule).
 * It shows everything the user needs to know about a particular analysis of the selected molecule.
 * The analyzed labels are not inherently shown, the user has to click to expand the analysisInfo and view them.
 * @param analysis The analysis to be described
 * @returns {JSX.Element} The name of the model, its ID, and the analyzed labels with their values.
 * @constructor
 */
export default function AnalysisInfo({ analysis }) {
  const [expand, setExpand] = React.useState(false)
  const toggleExpand = () => {
    setExpand(!expand)
  }

  return (
    <>
      <ListItemButton onClick={() => toggleExpand()}>
        <ListItemText
          primary={analysis.modelName}
          secondary={`Trained Model ID: ${analysis.fittingID}`}
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
                  primary={`${camelToNaturalString(key)}: ${value.toString()}`}
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
