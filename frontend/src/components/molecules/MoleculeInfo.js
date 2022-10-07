import React from 'react'
import { Divider, List, ListItem, ListItemText } from '@mui/material'
import AnalysisInfo from './AnalysisInfo'
import PropTypes from 'prop-types'

// TODO: Check .map keys again at the end
export default function MoleculeInfo({ molecule }) {
  return (
    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
      {molecule.analyses.length !== 0 ? (
        <>
          <ListItem>
            <ListItemText primary="Analyzed Properties:" />
          </ListItem>
          <Divider />
        </>
      ) : (
        <ListItem>
          <ListItemText primary="No analyses available" />
        </ListItem>
      )}
      {molecule.analyses.map((analysis, i) => {
        return (
          <React.Fragment key={`${molecule.smiles}-${analysis.fittingID}-${i}`}>
            {i === 0 ? null : <Divider></Divider>}
            <AnalysisInfo analysis={analysis}></AnalysisInfo>
          </React.Fragment>
        )
      })}
    </List>
  )
}

MoleculeInfo.propTypes = {
  molecule: PropTypes.object.isRequired,
}
