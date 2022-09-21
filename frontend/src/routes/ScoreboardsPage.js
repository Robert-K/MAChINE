import * as React from 'react'
import { Box, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Api from '../api'

let loaded = false

export default function ScoreboardsPage() {
  const [fittingRows, setFittingRows] = React.useState([])
  if (!loaded) {
    Api.getFittings().then((data) => {
      setFittingRows(data)
      loaded = true // quick fix to spot infinite requests
    })
  }
  return (
    <div align="center">
      <Box sx={{ mx: 5, mb: 5, mt: 2 }}>
        <Typography sx={{ fontSize: 20 }}>Best Models</Typography>
        <Box sx={{ maxWidth: 1000 }}>
          {DataTable(fittingColumns, fittingRows)}
        </Box>

        <Typography sx={{ mt: 5, fontSize: 20 }}>Best Molecules</Typography>
        <Box sx={{ maxWidth: 1000 }}>
          {DataTable(moleculeColumns, moleculeRows)}
        </Box>
      </Box>
    </div>
  )
}

const fittingColumns = [
  {
    field: 'id',
    headerName: 'ID',
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    flex: 4,
    minWidth: 180,
  },
  {
    field: 'modelID',
    headerName: 'Model ID',
    headerAlign: 'center',
    align: 'center',
    type: 'number',
    flex: 4,
    minWidth: 180,
  },
  {
    field: 'modelName',
    headerName: 'Model Name',
    headerAlign: 'center',
    align: 'right',
    sortable: false,
    flex: 3,
    minWidth: 140,
  },
  {
    field: 'datasetID',
    headerName: 'Dataset ID',
    headerAlign: 'center',
    align: 'right',
    type: 'number',
    flex: 2,
    minWidth: 90,
  },
  {
    field: 'labels',
    headerName: 'Label',
    headerAlign: 'center',
    align: 'center',
    flex: 2,
    minWIdth: 90,
  },
  {
    field: 'epochs',
    headerName: 'Epochs',
    headerAlign: 'center',
    align: 'right',
    flex: 2,
    minWidth: 70,
  },
  {
    field: 'batchSize',
    headerName: 'Batch Size',
    headerAlign: 'center',
    align: 'right',
    flex: 2,
    minWidth: 85,
  },
  {
    field: 'accuracy',
    headerName: 'Accuracy',
    headerAlign: 'center',
    align: 'right',
    flex: 2,
    minWidth: 70,
  },
]

const moleculeColumns = [
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

let moleculeRows = []
Api.getMoleculeList().then((data) => {
  moleculeRows = data
})

function DataTable(columns, rows) {
  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        hideFooterPagination={true}
        experimentalFeatures={{ columnGrouping: true }}
      />
    </div>
  )
}
