import React from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

export default function scoreboards() {
  return (
    <div align="center">
      <Box sx={{ m: 5 }}>
        <Typography>Best Models</Typography>
        {bestModels()}
        <Typography sx={{ mt: 5 }}>Best Molecules</Typography>
        {bestMolecules()}
      </Box>
    </div>
  )
}

const modelColumns = [
  { id: 'place', label: 'Place', align: 'center' },
  { id: 'name', label: 'Name', align: 'center' },
  { id: 'accuracy', label: 'Accuracy', align: 'center' },
  { id: 'epochs', label: 'Epochs', align: 'center' },
]

const moleculeColumns = [
  { id: 'place', label: 'Place', align: 'center' },
  { id: 'name', label: 'Name', align: 'center' },
  { id: 'toxicity', label: 'Toxicity', align: 'center' },
  { id: 'conductivity', label: 'Conductivity', align: 'center' },
]

function createModelData(place, name, accuracy, epochs) {
  return { place, name, accuracy, epochs }
}

function createMoleculeData(place, name, toxicity, conductivity) {
  return { place, name, toxicity, conductivity }
}

const modelRows = [createModelData(1, 'ModelTest', 100, 20)]

const moleculeRows = [createMoleculeData(1, 'MoleculeTest', 200, 10)]

function bestModels() {
  return (
    <Paper>
      <TableContainer sx={{ maxHeight: 250 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {modelColumns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {modelRows.map((row) => {
              return (
                <TableRow hover role="checkbox" key={row.name}>
                  {modelColumns.map((column) => {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {row[column.id]}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

function bestMolecules() {
  return (
    <Paper>
      <TableContainer sx={{ maxHeight: 250 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {moleculeColumns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {moleculeRows.map((row) => {
              return (
                <TableRow hover role="checkbox" key={row.name}>
                  {moleculeColumns.map((column) => {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {row[column.id]}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
