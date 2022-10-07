import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { Kekule } from 'kekule'
import * as THREE from 'three'

Kekule.externalResourceManager.register('three.js', THREE)
const chemViewer = new Kekule.ChemWidget.Viewer(document)
chemViewer.setDrawDimension('100%', '100%')
chemViewer.setRenderType(Kekule.Render.RendererType.R3D)
chemViewer
  .setEnableToolbar(true)
  .setToolButtons([
    'molDisplayType',
    'molHideHydrogens',
    'zoomIn',
    'zoomOut',
    'rotateLeft',
    'rotateRight',
    'rotateX',
    'rotateY',
    'rotateZ',
  ])

export default function MoleculeRenderer({ moleculeDoc, width, height }) {
  React.useEffect(() => {
    chemViewer.appendToElem(document.getElementById('renderer'))
  }, [])

  React.useEffect(() => {
    chemViewer.setChemObj(moleculeDoc)
  }, [moleculeDoc])

  return <Box id="renderer" sx={{ width, height }} />
}

MoleculeRenderer.propTypes = {
  moleculeDoc: PropTypes.any,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
}
