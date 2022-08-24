import React, { useEffect } from 'react'
import { Kekule } from 'kekule'
import PropTypes from 'prop-types'
import * as THREE from 'three'
import { Box } from '@mui/material'

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
  useEffect(() => {
    chemViewer.appendToElem(document.getElementById('renderer'))
  }, [])

  useEffect(() => {
    chemViewer.setChemObj(moleculeDoc)
  }, [moleculeDoc])

  return <Box id="renderer" sx={{ width, height }} />
}

MoleculeRenderer.propTypes = {
  moleculeDoc: PropTypes.any,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
}
