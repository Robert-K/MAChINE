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

export default function ScoreboardsPage() {
  prepareContent()
  return (
    <div align="center">
      <Box sx={{ mx: 5, mb: 5, mt: 2 }}>
        <Typography sx={{ fontSize: 20 }}>Best Models</Typography>
        {table(modelColumns, modelRows)}
        <Typography sx={{ mt: 5, fontSize: 20 }}>Best Molecules</Typography>
        {table(moleculeColumns, moleculeRows)}
      </Box>
    </div>
  )
}

const modelColumns = [
  { id: 'place', label: 'Place', align: 'center' },
  { id: 'name', label: 'Name', align: 'center' },
  { id: 'accuracy', label: 'Accuracy', align: 'center' },
  { id: 'epochs', label: 'Epochs', align: 'center' },
  { id: 'batch size', label: 'Batch Size', align: 'center' },
]

const moleculeColumns = [
  { id: 'place', label: 'Place', align: 'center' },
  { id: 'name', label: 'Name', align: 'center' },
  { id: 'toxicity', label: 'Toxicity', align: 'center' },
  { id: 'conductivity', label: 'Conductivity', align: 'center' },
]

function createModelData(place, name, accuracy, epochs, batchSize) {
  return { place, name, accuracy, epochs, batchSize }
}

function createMoleculeData(place, name, toxicity, conductivity) {
  return { place, name, toxicity, conductivity }
}

const modelRows = [createModelData(1, 'ModelTest', 100, 20, 15)]

const moleculeRows = [createMoleculeData(1, 'MoleculeTest', 200, 10)]

function prepareContent() {
  // modelRows = api.getModelList()
  // moleculeRows = api.getMoleculeList()
}

function table(tableColumns, tableRows) {
  return (
    <Paper>
      <TableContainer sx={{ maxHeight: 250 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {tableColumns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row) => {
              return (
                <TableRow hover role="checkbox" key={row.name}>
                  {tableColumns.map((column) => {
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
