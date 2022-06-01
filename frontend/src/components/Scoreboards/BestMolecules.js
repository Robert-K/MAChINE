import React from 'react'
import { TableStyle } from '../styles/table.styled'

export default function bestMolecules() {
  const moleculeArray = [
    { name: 'Ethane', toxicity: 7, conductivity: 9 },
    { name: 'Methane', toxicity: 13, conductivity: 2 },
    { name: 'Propane', toxicity: 8, conductivity: 1 },
  ]
  return (
    <>
      <TableStyle bordered hover>
        <thead>
          <tr>
            <th>Place</th>
            <th>Name</th>
            <th>Toxicity</th>
            <th>Conductivity</th>
          </tr>
        </thead>
        <tbody>{moleculeArray.map(renderMolecule)}</tbody>
      </TableStyle>
    </>
  )
}

function renderMolecule(molecule, index) {
  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{molecule.name}</td>
      <td>{molecule.toxicity}</td>
      <td>{molecule.conductivity}</td>
    </tr>
  )
}
