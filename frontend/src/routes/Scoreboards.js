import React from 'react'

// TODO: widen tables. Why is 100% width only half?

import styled from 'styled-components'

const Table = styled.table`
  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid white;
  }
  th {
    background: plum;
    border-bottom: 3px solid white;
    color: white;
    font-weight: bold;
  }
  td {
    width: 30%;
    color: white;
  }
  th,
  td {
    padding: 1em;
    text-align: center;
    :last-child {
      border-right: 0;
    }
    :first-child {
      width: 10%;
    }
  }
`

export default function scoreboards() {
  return (
    <div align="center">
      {bestModels()}
      {bestMolecules()}
    </div>
  )
}

function bestModels() {
  const modelArray = [
    { name: 'Model A', accuracy: 80, epochs: 7 },
    { name: 'Model B', accuracy: 80, epochs: 7 },
    { name: 'Model C', accuracy: 80, epochs: 7 },
  ]
  return (
    <Table bordered hover>
      <thead>
        <tr>
          <th>Place</th>
          <th>Name</th>
          <th>Accuracy</th>
          <th>Epochs</th>
        </tr>
      </thead>
      <tbody>{modelArray.map(renderModel)}</tbody>
    </Table>
  )
}

function bestMolecules() {
  const moleculeArray = [
    { name: 'Ethane', toxicity: 7, conductivity: 9 },
    { name: 'Methane', toxicity: 13, conductivity: 2 },
    { name: 'Propane', toxicity: 8, conductivity: 1 },
  ]
  return (
    <Table bordered hover>
      <thead>
        <tr>
          <th>Place</th>
          <th>Name</th>
          <th>Toxicity</th>
          <th>Conductivity</th>
        </tr>
      </thead>
      <tbody>{moleculeArray.map(renderMolecule)}</tbody>
    </Table>
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

function renderModel(model, index) {
  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{model.name}</td>
      <td>{model.accuracy}</td>
      <td>{model.epochs}</td>
    </tr>
  )
}
