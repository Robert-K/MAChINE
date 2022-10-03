import * as React from 'react'
import { Box, Button, IconButton, Paper, Typography } from '@mui/material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import DeleteIcon from '@mui/icons-material/Delete'
import { DataGrid } from '@mui/x-data-grid'
import api from '../api'
import UserContext from '../context/UserContext'
import PropTypes from 'prop-types'

export default function ScoreboardsPage() {
  const [fittingRows, setFittingRows] = React.useState([])
  const [highlightedRows, setHighlightedRows] = React.useState([])

  const { adminMode, setAdminMode } = React.useContext(UserContext)
  const user = React.useContext(UserContext)

  const fittingColumns = [
    {
      field: 'id',
      headerName: <b>ID</b>,
      headerAlign: 'center',
      align: 'right',
      description:
        'The ID got created automatically. It is unique and IDentifys a fitting',
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            {params.id}
            {adminMode ? (
              <IconButton
                onClick={() => {
                  api.deleteScoreboardFitting(params.id).then((response) => {
                    refresh()
                  })
                }}
              >
                <DeleteIcon />
              </IconButton>
            ) : null}
          </div>
        )
      },
      flex: 4,
      minWidth: 180,
    },
    {
      field: 'userName',
      headerName: <b>User Name</b>,
      headerAlign: 'center',
      align: 'center',
      flex: 4,
      minWidth: 150,
    },
    {
      field: 'modelName',
      headerName: <b>Model Name</b>,
      headerAlign: 'center',
      align: 'center',
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

  React.useEffect(() => {
    refresh()
  }, [user])

  function refresh() {
    api.getScoreboardSummaries().then((data) => {
      setFittingRows(data)
    })
    api.getFittings().then((data) => {
      setHighlightedRows(data)
    })
  }

  return (
    <div align="center">
      <Box
        sx={{
          mx: 5,
          mb: 5,
          mt: 2,
          '& .table-theme': {
            bgcolor: 'primary.light',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          },
        }}
      >
        <Typography sx={{ m: 4 }} variant="h4">
          Best Models
        </Typography>
        {adminMode ? (
          <AdminPanel changeFunc={setAdminMode} refreshFunc={refresh} />
        ) : null}
        <Paper sx={{ maxWidth: 1000, m: 5 }}>
          <DataTable
            columns={fittingColumns}
            rows={fittingRows}
            highlightedRows={highlightedRows}
          />
        </Paper>
      </Box>
    </div>
  )
}

function AdminPanel({ changeFunc, refreshFunc }) {
  return (
    <Box>
      <Button
        variant="contained"
        sx={{ m: 3 }}
        onClick={() => {
          api.deleteScoreboardFittings().then((response) => {
            refreshFunc()
          })
        }}
      >
        {' '}
        {'Delete All!'}
        <DeleteSweepIcon sx={{ m: 1 }} />{' '}
      </Button>
      <Button
        variant="contained"
        sx={{ m: 3 }}
        onClick={() => {
          changeFunc(false)
        }}
      >
        {'Leave Admin Mode'}
        <AdminPanelSettingsIcon sx={{ m: 1 }} />
      </Button>
    </Box>
  )
}

AdminPanel.propTypes = {
  changeFunc: PropTypes.func,
  refreshFunc: PropTypes.func,
}

function DataTable({ columns, rows, highlightedRows }) {
  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        sx={{ borderColor: 'primary.light' }}
        rows={rows}
        columns={columns}
        disableColumnMenu={true}
        hideFooter={true}
        experimentalFeatures={{ columnGrouping: true }}
        getRowClassName={(params) => {
          return highlightedRows.some(({ id }) => id === params.row.id)
            ? 'table-theme'
            : null
        }}
      />
    </div>
  )
}

DataTable.propTypes = {
  columns: PropTypes.any,
  rows: PropTypes.any,
  highlightedRows: PropTypes.array,
}
