import React from 'react'
import { Box, Button, Card, IconButton, Stack, Typography } from '@mui/material'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import DeleteIcon from '@mui/icons-material/Delete'
import { DataGrid } from '@mui/x-data-grid'
import api from '../api'
import UserContext from '../context/UserContext'
import PropTypes from 'prop-types'
import { camelToNaturalString } from '../utils'

/**
 * The Scoreboard gets its data via a Api request and the userContext, thus no paramets need to be specified
 * @returns {JSX.Element}
 * @constructor
 */
export default function ScoreboardsPage() {
  const [fittingRows, setFittingRows] = React.useState([])
  const [highlightedRows, setHighlightedRows] = React.useState([])
  const { adminMode } = React.useContext(UserContext)

  // defining the order and context of the columns
  const fittingColumns = [
    {
      field: 'userName', // the api request delivers an object, the field value is the key to be used
      headerName: 'Username',
      headerAlign: 'center',
      align: 'center',
      flex: 4, // flex is for scaling, a flex 4 column will be twice as wide as an flex 2 columns
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
      // a renderCell allows to put html inside a Table cell, like for example a button
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            sx={{
              width: '100%',
              height: '100%',
            }}
          >
            <Box
              display="flex"
              sx={{
                flexGrow: '1',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div>{params.id}</div>
            </Box>
            <Box display="flex">
              {adminMode ? (
                <IconButton
                  sx={{ alignItems: 'center' }}
                  onClick={() => {
                    api.deleteScoreboardFitting(params.id).then(() => {
                      refresh()
                    })
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              ) : null}
            </Box>
          </Box>
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
      // capitalize the first letter of each label
      renderCell: (params) => {
        return <div>{camelToNaturalString(params.value.join(', '))}</div>
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
      headerName: 'Accuracy(R Squared)',
      headerAlign: 'center',
      align: 'center',
      flex: 2,
      minWidth: 70,
    },
  ]

  React.useEffect(() => {
    refresh()
  }, [])

  /**
   * gets the required info from the backend: all the fittings to be displayed in the Scoreboard and
   * all fitting of the current use to be able to highlight them
   */
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
        {adminMode ? <AdminPanel refreshFunc={refresh} /> : null}
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

/**
 * a hidden panel with extra features that shows up when adminMode == true
 * @param refreshFunc gets called when the button inside this panel "Delete All!" is clicked
 * @returns {JSX.Element}
 * @constructor
 */
function AdminPanel({ refreshFunc }) {
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
    </Box>
  )
}

AdminPanel.propTypes = {
  changeFunc: PropTypes.func,
  refreshFunc: PropTypes.func,
}

/**
 * creates a styled table
 * @param columns array of object that describes the columns
 * @param rows array of objects that represent a row each, where the keys match the 'field' values stated in columns
 * @param highlightedRows array of objects just like 'rows', the cut of 'rows' and 'highlightedRows' gets highlighted
 * @returns {JSX.Element}
 * @constructor
 */

function DataTable({ columns, rows, highlightedRows }) {
  return (
    <DataGrid
      sx={{ height: '72vh', width: '100%' }}
      rows={rows}
      columns={columns}
      disableColumnMenu={true}
      hideFooter={true}
      pageSize={10}
      // check for each fitting if it's been created by the current user
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
