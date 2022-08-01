import { Kekule } from 'kekule'
import * as THREE from 'three'
import React, { useEffect } from 'react'

Kekule.externalResourceManager.register('three.js', THREE)

export default function MoleculeRenderer() {
  useEffect(() => {
    const chemViewer = new Kekule.ChemWidget.Viewer(
      document.getElementById('renderer')
    )

    chemViewer.setDimension('100%', '600px')

    const mol = new Kekule.Molecule()

    // add atoms to molecule
    mol.appendNode(
      new Kekule.Atom().setSymbol('C').setCoord2D({ x: 0, y: 0.8 })
    )
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
    mol.appendNode(
      new Kekule.Atom().setSymbol('C').setCoord2D({ x: 0.69, y: 0.4 })
    )
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

    chemViewer.setChemObj(mol)

    chemViewer.setRenderType(Kekule.Render.RendererType.R3D)
  })
  return <div id="renderer" />
}
