import { Kekule } from 'kekule'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'

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
  .setChemToolButtons([
    'manipulate',
    'erase',
    'bond',
    'atomAndFormula',
    'charge',
  ])
// Makes atoms atom-colored and bonds longer for better 3D View
composer.getEditorConfigs().structureConfigs.defBondLength = 1
composer.getRenderConfigs().colorConfigs.useAtomSpecifiedColor = true
composer.getEditorConfigs().hotKeyConfigs.setHotKeys([])

export default function MoleculeEditor({ moleculeDoc, width, height }) {
  useEffect(() => {
    composer.appendToElem(document.getElementById('editor'))
  }, [])

  useEffect(() => {
    composer.setChemObj(moleculeDoc)
  }, [moleculeDoc])

  useEffect(() => {
    composer.setDimension(width, height)
  }, [width, height])

  return <Box component="div" id="editor" sx={{ height, width }}></Box>
}

MoleculeEditor.propTypes = {
  moleculeDoc: PropTypes.any,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
}
