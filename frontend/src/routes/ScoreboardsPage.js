import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Api from '../api'

export default function ScoreboardsPage() {
  const [fittingrows, setFittingRows] = React.useState([])
  Api.getFittings().then((data) => {
    setFittingRows(data)
  })

  return (
    <div align="center">
      <Box sx={{ mx: 5, mb: 5, mt: 2 }}>
        <Typography sx={{ fontSize: 20 }}>Best Models</Typography>
        {DataTable(fittingcolumns, fittingrows)}
        <Typography sx={{ mt: 5, fontSize: 20 }}>Best Molecules</Typography>
        {DataTable(moleculecolumns, moleculerows)}
      </Box>
    </div>
  )
}

const fittingcolumns = [
  { field: 'id', headerName: 'ID', sortable: false, width: 180 },
  { field: 'modelID', headerName: 'Model ID', type: 'number', width: 180 },
  { field: 'modelName', headerName: 'Model Name', sortable: false, width: 140 },
  {
    field: 'datasetID',
    headerName: 'Dataset ID',
    type: 'number',
    width: 90,
  },
  {
    field: 'epochs',
    headerName: 'Epochs',

    width: 70,
  },
  {
    field: 'batchSize',
    headerName: 'Batch Size',
    width: 85,
  },
  {
    field: 'accuracy',
    headerName: 'Accuracy',
    width: 70,
  },
]

const moleculecolumns = [
  {
    field: 'name',
    headerName: 'Name',
    sortable: false,
    width: 120,
  },
  {
    field: 'smiles',
    headerName: 'Smiles Code',
    sortable: false,
    width: 120,
  },
  {
    field: 'cml',
    headerName: 'CML Code',
    sortable: false,
    width: 130,
  },
]

let moleculerows = []
Api.getMoleculeList().then((data) => {
  moleculerows = data
})

function DataTable(columns, rows) {
  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        hideFooterPagination={true}
      />
    </div>
  )
}
