import React, { useEffect } from 'react'
import { Kekule } from 'kekule'
import PropTypes from 'prop-types'
import * as THREE from 'three'

Kekule.externalResourceManager.register('three.js', THREE)
const chemViewer = new Kekule.ChemWidget.Viewer(document)
chemViewer.setDrawDimension('800px', '500px')
chemViewer.setRenderType(Kekule.Render.RendererType.R3D)

export default function MoleculeRenderer({ molecule, width, height }) {
  useEffect(() => {
    chemViewer.appendToElem(document.getElementById('renderer'))
  }, [])

  useEffect(() => {
    chemViewer.setChemObj(molecule)
  }, [molecule])

  useEffect(() => {
    chemViewer.setDrawDimension(width, height)
  }, [width, height])

  return <div id="renderer" />
}

MoleculeRenderer.propTypes = {
  molecule: PropTypes.any,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
}
