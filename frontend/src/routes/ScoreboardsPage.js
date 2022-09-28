import * as React from 'react'
import { Box, Button, IconButton, Paper, Typography } from '@mui/material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import DeleteIcon from '@mui/icons-material/Delete'
import { DataGrid } from '@mui/x-data-grid'
import Api from '../api'
import UserContext from '../context/UserContext'

export default function ScoreboardsPage() {
  const [fittingRows, setFittingRows] = React.useState([])
  const [adminMode, setAdminMode] = React.useState(true)
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
                  Api.deleteScoreboardFitting(params.id).then((response) => {
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
    Api.getScoreboardSummaries().then((data) => {
      setFittingRows(data)
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
        {AdminPanel(adminMode, setAdminMode, refresh)}
        <Paper sx={{ maxWidth: 1000, m: 5 }}>
          {DataTable(fittingColumns, fittingRows)}
        </Paper>
      </Box>
    </div>
  )
}

function AdminPanel(active, changefunc, reffunc) {
  if (active) {
    return (
      <Box>
        <Button
          variant="contained"
          sx={{ m: 3 }}
          onClick={() => {
            Api.deleteScoreboardFittings().then((response) => {
              reffunc()
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
            changefunc(false)
          }}
        >
          {'Leave Admin Mode'}
          <AdminPanelSettingsIcon sx={{ m: 1 }} />
        </Button>
      </Box>
    )
  }
}

function DataTable(columns, rows) {
  const [userFittings, setUserFittings] = React.useState([])
  const user = React.useContext(UserContext)
  React.useEffect(() => {
    Api.getFittings().then((data) => {
      setUserFittings(data)
    })
  }, [user])
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
          for (let i = 0; i < userFittings.length; i++) {
            if (params.row.id === userFittings[i].id) {
              return 'table-theme'
            }
          }
        }}
      />
    </div>
  )
}
