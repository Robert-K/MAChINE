import React from 'react'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { Kekule } from 'kekule'

const C = Kekule.Editor.ObjModifier.Category
// the composer is the actual editor, gets rendered on a root element later
const composer = new Kekule.Editor.Composer(document)
composer
  .setPredefinedSetting('molOnly')
  // only one molecule at a time
  .setAllowCreateNewChild(false)
  // only allow these functions
  .setCommonToolButtons([
    'undo',
    'redo',
    'zoomIn',
    'zoomOut',
    /* 'config', // These are great for debugging
    'objInspector', */
  ])
  // only allow these tools
  .setChemToolButtons(['manipulate', 'erase', 'bond', 'atom'])
composer.setAllowedObjModifierCategories([C.GENERAL])
// Makes atoms atom-colored and bonds longer for better 3D View
composer.getEditorConfigs().structureConfigs.defBondLength = 1
composer.getRenderConfigs().colorConfigs.useAtomSpecifiedColor = true
composer.getEditorConfigs().hotKeyConfigs.setHotKeys([])

/**
 * creats a box containing a Molecule Editor from "Kekule"
 * @param moleculeDoc a "Kekule" molecule object that can be used for in- and output of molecule information
 * @param width the width of the editor, this should be static
 * @param height the height of the editor, this should be static too
 * @returns {JSX.Element} a box containing the molecule editor with a fixed size
 * @constructor
 */
export default function MoleculeEditor({ moleculeDoc, width, height }) {
  React.useEffect(() => {
    // defining the root object where the editor should be rendered into
    composer.appendToElem(document.getElementById('editor'))
  }, [])

  React.useEffect(() => {
    composer.setChemObj(moleculeDoc)
  }, [moleculeDoc])

  React.useEffect(() => {
    composer.setDimension(width, height)
  }, [width, height])

  // return an empty object, the content will be rendered inside later using a useEffect
  return <Box component="div" id="editor" sx={{ height, width }}></Box>
}

MoleculeEditor.propTypes = {
  moleculeDoc: PropTypes.any,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
}
