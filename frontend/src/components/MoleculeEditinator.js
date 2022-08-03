import React, { useEffect } from 'react'
import { Box, Grid } from '@mui/material'
import { Kekule } from 'kekule'
import * as THREE from 'three'
import PropTypes from 'prop-types'

// create molecule first
const mol = new Kekule.Molecule()

// add atoms to molecule
mol.appendNode(new Kekule.Atom().setSymbol('C').setCoord2D({ x: 0, y: 0.8 }))
// explicit set mass number of an atom
mol.appendNode(
  new Kekule.Atom()
    .setSymbol('C')
    .setMassNumber(13)
    .setCoord2D({ x: -0.69, y: 0.4 })
)

mol.appendNode(
  new Kekule.Atom().setSymbol('C').setCoord2D({ x: -0.69, y: -0.4 })
)
// a pseudo atom
mol.appendNode(
  new Kekule.Pseudoatom()
    .setAtomType(Kekule.PseudoatomType.ANY)
    .setCoord2D({ x: 0, y: -0.8 })
)
mol.appendNode(
  new Kekule.Atom().setSymbol('C').setCoord2D({ x: 0.69, y: -0.4 })
)
mol.appendNode(new Kekule.Atom().setSymbol('C').setCoord2D({ x: 0.69, y: 0.4 }))
// a variable atom
mol.appendNode(
  new Kekule.VariableAtom()
    .setAllowedIsotopeIds(['F', 'Cl', 'Br'])
    .setCoord2D({ x: 1.39, y: 0.8 })
)

// add bonds to molecule
//   here a shortcut method appendBond(atomIndexes, bondOrder) is used
mol.appendBond([0, 1], 1)
mol.appendBond([1, 2], 2)
mol.appendBond([2, 3], 1)
mol.appendBond([3, 4], 2)
mol.appendBond([4, 5], 1)
mol.appendBond([5, 0], 2)
mol.appendBond([5, 6], 1)

export default class MoleculeEditinator extends React.Component {
  constructor(props) {
    super(props)
    this.molecule = mol
  }

  handleChange(i) {
    this.molecule = i
  }

  render3D(i) {
    return <MoleculeRenderer value={i} />
  }

  renderEditor() {
    return (
      <MoleculeEditor onChange={(molecule) => this.handleChange(molecule)} />
    )
  }

  render() {
    return (
      <Grid container sx={{ m: 2 }}>
        <Grid item>{this.renderEditor()}</Grid>
        <Grid item>{this.render3D(this.molecule)} </Grid>
      </Grid>
    )
  }
}

function MoleculeEditor(props) {
  let composer
  useEffect(() => {
    composer = new Kekule.Editor.Composer(document.getElementById('editor'))
    composer.setDimension('650px', '600px')
    composer.setChemObj(mol)
  }, [])
  return (
    <div
      style={{ width: '100%', height: '500px' }}
      id="editor"
      onChange={() => {
        props.onChange(composer.exportObjs(Kekule.Molecule)[0])
      }}
    ></div>
  )
}

MoleculeEditor.propTypes = {
  onChange: PropTypes.func,
}

function MoleculeRenderer(props) {
  Kekule.externalResourceManager.register('three.js', THREE)
  useEffect(() => {
    const chemViewer = new Kekule.ChemWidget.Viewer(
      document.getElementById('renderer')
    )

    chemViewer.setDrawDimension('650px', '600px')

    // eslint-disable-next-line react/prop-types
    chemViewer.setChemObj(props.value)
    chemViewer.setRenderType(Kekule.Render.RendererType.R3D)
  })
  return (
    <Box>
      <div id="renderer" />
    </Box>
  )
}
