import { Kekule } from 'kekule'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const composer = new Kekule.Editor.Composer(document)
composer.appendToElem(document.getElementById('editor'))
composer.setCommonToolButtons(['undo', 'redo', 'zoomIn', 'zoomOut'])
composer.setChemToolButtons([
  'manipulate',
  'erase',
  'bond',
  'atomAndFormula',
  'glyph',
])

export default function MoleculeEditor({ molecule, onChange, width, height }) {
  useEffect(() => {
    composer.appendToElem(document.getElementById('editor'))
  }, [])

  useEffect(() => {
    composer.setChemObj(molecule)
  }, [molecule])

  useEffect(() => {
    composer.setDimension(width, height)
  }, [width, height])

  return (
    <div
      id="editor"
      onChange={() => onChange(composer.exportObjs(Kekule.Molecule)[0])}
    ></div>
  )
}

MoleculeEditor.propTypes = {
  onChange: PropTypes.func,
  molecule: PropTypes.any,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
}
