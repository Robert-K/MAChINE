import * as React from 'react'
import { Box, Paper, Typography } from '@mui/material'
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
  const fittingColumns = [
    {
      field: 'id',
      headerName: <b>ID</b>,
      headerAlign: 'center',
      align: 'center',
      description:
        'The ID got created automatically. It is unique and IDentifys a fitting',
      sortable: false,
      flex: 4,
      minWidth: 180,
    },
    {
      field: 'modelID',
      headerName: <b>Model ID</b>,
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      flex: 4,
      minWidth: 180,
    },
    {
      field: 'modelName',
      headerName: <b>Model Name</b>,
      headerAlign: 'center',
      align: 'right',
      description: 'The Name of the Model chosen by its creator',
      sortable: false,
      flex: 3,
      minWidth: 140,
    },
    {
      field: 'datasetID',
      headerName: <b>Dataset ID</b>,
      headerAlign: 'center',
      align: 'right',
      type: 'number',
      flex: 2,
      minWidth: 90,
    },
    {
      field: 'labels',
      headerName: <b>Label</b>,
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      minWIdth: 90,
    },
    {
      field: 'epochs',
      headerName: <b>Epochs</b>,
      headerAlign: 'center',
      align: 'right',
      flex: 2,
      minWidth: 70,
    },
    {
      field: 'batchSize',
      headerName: <b>Batch Size</b>,
      headerAlign: 'center',
      align: 'right',
      flex: 2,
      minWidth: 85,
    },
    {
      field: 'accuracy',
      headerName: <b>Accuracy</b>,
      headerAlign: 'center',
      align: 'right',
      flex: 2,
      minWidth: 70,
    },
  ]

  return (
    <div align="center">
      <Box sx={{ mx: 5, mb: 5, mt: 2 }}>
        <Typography sx={{ m: 4 }} variant="h4">
          Best Models
        </Typography>
        <Paper sx={{ maxWidth: 1000, m: 5 }}>
          {DataTable(fittingColumns, fittingRows)}
        </Paper>
      </Box>
    </div>
  )
}

function DataTable(columns, rows) {
  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        sx={{ borderColor: 'primary.light' }}
        rows={rows}
        columns={columns}
        disableColumnMenu={true}
        hideFooter={true}
        experimentalFeatures={{ columnGrouping: true }}
      />
    </div>
  )
}
