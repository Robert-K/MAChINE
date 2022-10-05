/**
 * This page is reached when clicking 'analyze' on a molecule.
 */

import React from 'react'
import {
  Box,
  Card,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material'
import FittingCard from '../components/models/FittingCard'
import Button from '@mui/material/Button'
import DetailsPopper from '../components/shared/DetailsPopper'
import api from '../api'
import UserContext from '../context/UserContext'
import HelpContext from '../context/HelpContext'
import HelpPopper from '../components/shared/HelpPopper'
import { useLocation, useNavigate } from 'react-router-dom'
import Histogram from '../components/datasets/Histogram'
import { camelToNaturalString } from '../utils'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

export default function FittingsPage() {
  const [fittingArray, setFittingArray] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [content, setContent] = React.useState(<h1>Placeholder</h1>)
  const [anchor, setAnchor] = React.useState(null)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [analysis, setAnalysis] = React.useState({})
  const [selectedFitting, setSelectedFitting] = React.useState({})
  const [highlightedIndices, setHighlightedIndices] = React.useState({
    empty: -1,
  })
  const [chartConfigs, setChartConfigs] = React.useState({
    empty: { data: [] },
  })
  const [loading, setLoading] = React.useState(false)
  const { state } = useLocation()
  const { selectedSmiles } = state
  const user = React.useContext(UserContext)
  const theme = useTheme()
  const navigate = useNavigate()

  React.useEffect(() => {
    api.getFittings().then((fittings) => setFittingArray(fittings))
  }, [user])

  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)
  React.useEffect(() => {
    if (Object.keys(selectedFitting).length !== 0) {
      api
        .getHistograms(selectedFitting.datasetID, selectedFitting.labels)
        .then((hists) => {
          if (hists !== null) {
            createChart(hists)
          }
        })
    }
  }, [selectedFitting])

  function createChart(hists) {
    const newCharts = {}
    const newIndices = {}
    selectedFitting.labels.forEach((label) => {
      const hist = hists[label]
      const newChart = {
        name: 'amount: ',
        data: [],
      }
      // create chart data from histogram
      for (let i = 0; i < hist.buckets.length; i++) {
        newChart.data.push({
          x: `[${hist.binEdges[i].toFixed(2)} , ${hist.binEdges[i + 1].toFixed(
            2
          )}]`,
          y: hist.buckets[i],
        })
      }
      newCharts[label] = newChart

      // determine index of analysis in chart
      newIndices[label] = -1
      for (
        let i = 0;
        i < hist.binEdges.length && analysis[label] > hist.binEdges[i];
        i++
      ) {
        newIndices[label] = i
      }
    })
    async function updateThings() {
      setChartConfigs(newCharts)
      setHighlightedIndices(newIndices)
      setLoading(false)
    }
    updateThings().then(handleClickOpenDialog)
  }

  const handlePopper = (target, content, show) => {
    setContent(content)
    setAnchor(target)
    setOpen(show)
  }

  const handleClickOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleGoToMol = () => {
    setOpenDialog(false)
    navigate('/molecules')
  }

  const handleAnalysis = (response) => {
    setAnalysis(response)
  }

  const handleHelpPopperOpen = (event, content) => {
    if (help.helpMode) {
      setHelpAnchorEl(event.currentTarget)
      setHelpPopperContent(content)
    }
  }
  function handleFittingSelection(fitting) {
    setLoading(true)
    api.analyzeMolecule(fitting.id, selectedSmiles).then((response) => {
      handleAnalysis(response)
      setSelectedFitting(fitting)
    })
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
  }
  const helpOpen = Boolean(helpAnchorEl)

  const handleClick = () => {
    navigate('/models/base-models')
  }

  if (fittingArray.length === 0) {
    return (
      <Box sx={{ m: 5 }}>
        <Grid container spacing={5}>
          <Grid item xs={3}>
            <Card>
              <CardActionArea onClick={handleClick}>
                <Typography sx={{ m: 5, textAlign: 'center' }}>
                  You have no trained models to display! Train one of your
                  models to use it to analyze a molecule.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: -4,
                    mb: 2,
                  }}
                >
                  <AddCircleOutlineOutlinedIcon
                    sx={{
                      color: theme.palette.primary.main,
                    }}
                  />
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )
  } else {
    return (
      <Box sx={{ m: 5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 5,
          }}
        >
          {fittingArray.map((fitting) => (
            <React.Fragment key={fitting.id}>
              <FittingCard
                fitting={fitting}
                key={fitting.id}
                sx={{ width: 500 }}
                clickFunc={(event) => {
                  handlePopper(
                    event.currentTarget,
                    <>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{ mb: 2 }}
                        onClick={handleFittingSelection}
                      >
                        Choose this model
                        {loading ? (
                          <CircularProgress
                            size="16px"
                            color="secondary"
                            sx={{ ml: 1 }}
                          />
                        ) : null}
                      </Button>
                      Labels:
                      {fitting.labels.map((label) => {
                        return (
                          <ListItem key={label}>
                            <ListItemText primary={`${label}`} />
                          </ListItem>
                        )
                      })}
                    </>,
                    event.currentTarget !== anchor || !open
                  )
                }}
                hoverFunc={(e) => {
                  handleHelpPopperOpen(
                    e,
                    'Click to analyze your molecule with this model!'
                  )
                }}
                leaveFunc={handleHelpPopperClose}
              />
            </React.Fragment>
          ))}

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="md"
          >
            <DialogTitle id="alert-dialog-title">
              {'You successfully analyzed your molecule!'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <b>Result:</b>
                <br />
                {Object.entries(analysis).map(
                  ([label, value]) => `${camelToNaturalString(label)}: ${value}`
                )}
              </DialogContentText>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '90%',
                }}
              >
                {Object.entries(chartConfigs).map(([label, chart], index) => {
                  return (
                    <Histogram
                      seriesObject={chart}
                      highlightedIndex={highlightedIndices[label]}
                      key={index}
                    />
                  )
                })}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Back</Button>
              <Button onClick={handleGoToMol} autoFocus>
                Go to Molecules
              </Button>
            </DialogActions>
          </Dialog>
          <DetailsPopper anchor={anchor} open={open} content={content} />
          <HelpPopper
            id="helpPopper"
            helpPopperContent={helpPopperContent}
            open={helpOpen}
            anchorEl={helpAnchorEl}
            onClose={handleHelpPopperClose}
          />
        </Box>
      </Box>
    )
  }
}
