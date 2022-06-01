import React from 'react'
import { TableStyle } from '../styles/table.styled'

export default function bestModels() {
  const modelArray = [
    { name: 'Model A', accuracy: 80, epochs: 7 },
    { name: 'Model B', accuracy: 80, epochs: 7 },
    { name: 'Model C', accuracy: 80, epochs: 7 },
  ]
  return (
    <TableStyle bordered hover>
      <thead>
        <tr>
          <th>Place</th>
          <th>Name</th>
          <th>Accuracy</th>
          <th>Epochs</th>
        </tr>
      </thead>
      <tbody>{modelArray.map(renderModel)}</tbody>
    </TableStyle>
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
