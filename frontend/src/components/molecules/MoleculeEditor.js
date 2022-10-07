import React from 'react'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { Kekule } from 'kekule'

const C = Kekule.Editor.ObjModifier.Category
const composer = new Kekule.Editor.Composer(document)
composer
  .setPredefinedSetting('molOnly')
  .setAllowCreateNewChild(false)
  .setCommonToolButtons([
    'undo',
    'redo',
    'zoomIn',
    'zoomOut',
    /* 'config', // These are great for debugging
    'objInspector', */
  ])
  .setChemToolButtons(['manipulate', 'erase', 'bond', 'atom'])
composer.setAllowedObjModifierCategories([C.GENERAL])
// Makes atoms atom-colored and bonds longer for better 3D View
composer.getEditorConfigs().structureConfigs.defBondLength = 1
composer.getRenderConfigs().colorConfigs.useAtomSpecifiedColor = true
composer.getEditorConfigs().hotKeyConfigs.setHotKeys([])

export default function MoleculeEditor({ moleculeDoc, width, height }) {
  React.useEffect(() => {
    composer.appendToElem(document.getElementById('editor'))
  }, [])

  React.useEffect(() => {
    composer.setChemObj(moleculeDoc)
  }, [moleculeDoc])

  React.useEffect(() => {
    composer.setDimension(width, height)
  }, [width, height])

  return <Box component="div" id="editor" sx={{ height, width }}></Box>
}

MoleculeEditor.propTypes = {
  moleculeDoc: PropTypes.any,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
}
