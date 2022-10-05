import * as React from 'react'
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
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

  const theme = useTheme()

  const fittingColumns = [
    {
      field: 'userName',
      headerName: 'Username',
      headerAlign: 'center',
      align: 'center',
      flex: 4,
      minWidth: 150,
    },

    {
      field: 'modelName',
      headerName: 'Modelname',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 3,
      minWidth: 140,
    },
    {
      field: 'id',
      headerName: 'Trained Model ID',
      headerAlign: 'center',
      align: 'center',
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
      minWidth: 200,
    },
    {
      field: 'datasetID',
      headerName: 'Dataset ID',
      headerAlign: 'center',
      align: 'center',
      type: 'number',
      flex: 2,
      minWidth: 90,
    },
    {
      field: 'labels',
      headerName: 'Label',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 2,
      minWidth: 90,
      renderCell: (params) => {
        const result = []
        for (let i = 0; i < params.value.length; i++) {
          result[i] =
            params.value[i].charAt(0).toUpperCase() + params.value[i].slice(1)
        }
        return <div>{result.join(', ')}</div>
      },
    },
    {
      field: 'epochs',
      headerName: 'Epochs',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      minWidth: 70,
    },
    {
      field: 'batchSize',
      headerName: 'Batch Size',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      minWidth: 85,
    },
    {
      field: 'accuracy',
      headerName: 'Accuracy',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      minWidth: 70,
    },
  ]

  React.useEffect(() => {
    refresh()
  }, [])

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
          mx: 4,
          mb: 4,
          mt: 1,
          '& .table-theme': {
            fontWeight: 'bold',
          },
        }}
      >
        <Typography sx={{ m: 4 }} variant="h4">
          Best Models
        </Typography>
        {adminMode ? (
          <AdminPanel changeFunc={setAdminMode} refreshFunc={refresh} />
        ) : null}
        <Card sx={{ maxWidth: '80vw', m: 4 }}>
          <DataTable
            columns={fittingColumns}
            rows={fittingRows}
            highlightedRows={highlightedRows}
          />
        </Card>
      </Box>
    </div>
  )
}

function AdminPanel({ changeFunc, refreshFunc }) {
  return (
    <Box>
      <Button
        variant="contained"
        size="large"
        sx={{ m: 1 }}
        onClick={() => {
          api.deleteScoreboardFittings().then(() => {
            refreshFunc()
          })
        }}
        endIcon={<DeleteSweepIcon />}
      >
        Delete All!
      </Button>
      <Button
        variant="contained"
        size="large"
        sx={{ m: 1 }}
        onClick={() => {
          changeFunc(false)
        }}
        endIcon={<AdminPanelSettingsIcon />}
      >
        Leave Admin Mode
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
    <DataGrid
      sx={{ height: '72vh', width: '100%' }}
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
      components={{
        NoRowsOverlay: () => (
          <Stack height="100%" alignItems="center" justifyContent="center">
            No trained models yet.
            <br />
            Be the first!
          </Stack>
        ),
      }}
    />
  )
}

DataTable.propTypes = {
  columns: PropTypes.any,
  rows: PropTypes.any,
  highlightedRows: PropTypes.array,
}
