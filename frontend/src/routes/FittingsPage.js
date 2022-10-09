import React from 'react'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  Zoom,
} from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import api from '../api'
import FittingCard from '../components/models/FittingCard'
import Histogram from '../components/datasets/Histogram'
import DetailsPopper from '../components/shared/DetailsPopper'
import HelpPopper from '../components/shared/HelpPopper'
import UserContext from '../context/UserContext'
import HelpContext from '../context/HelpContext'
import TrainingContext from '../context/TrainingContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { camelToNaturalString } from '../utils'
import PropTypes from 'prop-types'

/**
 * Selection component for fittings to analyze molecule in react-router location
 * Displays analysis results through a histogram in a dialog
 * @returns {JSX.Element}
 */
export default function FittingsPage() {
  const [fittingArray, setFittingArray] = React.useState([])
  const [openDetails, setOpenDetails] = React.useState(false)
  const [fittingDetails, setFittingDetails] = React.useState(
    <h1>Placeholder</h1>
  )
  const [detailsAnchor, setDetailsAnchor] = React.useState(null)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [analysis, setAnalysis] = React.useState({})
  const [highlightedIndices, setHighlightedIndices] = React.useState({
    empty: -1,
  })
  const [chartData, setChartData] = React.useState({
    empty: [],
  })
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)
  const user = React.useContext(UserContext)
  const training = React.useContext(TrainingContext)
  const { state } = useLocation()
  const { selectedSmiles } = state
  const theme = useTheme()
  const navigate = useNavigate()

  React.useEffect(() => {
    api.getFittings().then((fittings) => setFittingArray(fittings))
  }, [user, training.trainingStatus])

  async function handleFittingSelection(fitting) {
    return api.analyzeMolecule(fitting.id, selectedSmiles).then((response) => {
      return fetchHistograms(fitting, response)
    })
  }

  async function fetchHistograms(fitting, analysis) {
    if (Object.keys(fitting).length !== 0) {
      return api
        .getHistograms(fitting.datasetID, fitting.labels)
        .then((hists) => {
          if (hists !== null) {
            createChart(hists, analysis)
            return true
          }
        })
    }
  }

  function createChart(hists, analysis) {
    const newCharts = {}
    const newIndices = {}
    Object.entries(hists).forEach(([label, hist]) => {
      const newChartData = []
      // create chart data from histogram
      for (let i = 0; i < hist.buckets.length; i++) {
        newChartData.push({
          x: `[${hist.binEdges[i].toFixed(2)} , ${hist.binEdges[i + 1].toFixed(
            2
          )}]`,
          y: hist.buckets[i],
        })
      }
      newCharts[label] = newChartData

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

    setChartData(newCharts)
    setAnalysis(analysis)
    setHighlightedIndices(newIndices)
    setOpenDialog(true)
  }

  const handleDetailsPopper = (target, content, show) => {
    setFittingDetails(content)
    setDetailsAnchor(target)
    setOpenDetails(show)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleGoToMol = () => {
    setOpenDialog(false)
    navigate('/molecules')
  }

  const handleHelpPopperOpen = (event, content) => {
    if (help.helpMode) {
      setHelpAnchorEl(event.currentTarget)
      setHelpPopperContent(content)
    }
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
  }

  if (fittingArray.length === 0) {
    return (
      <Box sx={{ m: 5 }}>
        <Grid container spacing={5}>
          <Grid item xs={3}>
            <Zoom in timeout={1000}>
              <Card>
                <CardActionArea onClick={() => navigate('/models')}>
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
            </Zoom>
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
            <FittingCard
              fitting={fitting}
              key={fitting.id}
              clickFunc={(event) => {
                handleDetailsPopper(
                  event.currentTarget,
                  <FittingDetails
                    fitting={fitting}
                    onClickFunc={handleFittingSelection}
                  />,
                  event.currentTarget !== detailsAnchor || !openDetails
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
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  margin: 'auto',
                  width: '90%',
                }}
              >
                {Object.entries(chartData).map(([label, data], index) => {
                  return (
                    <Histogram
                      data={data}
                      highlightedIndex={highlightedIndices[label]}
                      title={`${camelToNaturalString(label)}: ${
                        analysis[label]
                      }`}
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
          <DetailsPopper
            anchor={detailsAnchor}
            open={openDetails}
            content={fittingDetails}
          />
          <HelpPopper
            id="helpPopper"
            helpPopperContent={helpPopperContent}
            open={Boolean(helpAnchorEl)}
            anchorEl={helpAnchorEl}
            onClose={handleHelpPopperClose}
          />
        </Box>
      </Box>
    )
  }
}

function FittingDetails({ fitting, onClickFunc }) {
  const [loading, setLoading] = React.useState(false)

  function handleClick() {
    setLoading(true)
    onClickFunc(fitting).then(() => setLoading(false))
  }

  return (
    <Box>
      <Button
        fullWidth
        variant="contained"
        sx={{ mb: 2 }}
        onClick={handleClick}
      >
        Choose this model
        {loading ? (
          <CircularProgress size="16px" color="inherit" sx={{ ml: 1 }} />
        ) : null}
      </Button>
      <List
        sx={{ py: 0, maxHeight: '55vh', overflow: 'auto' }}
        subheader="Labels:"
      >
        {fitting.labels.map((label) => {
          return (
            <ListItem key={label}>
              <ListItemText primary={camelToNaturalString(label)} />
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}

FittingDetails.propTypes = {
  fitting: PropTypes.object.isRequired,
  onClickFunc: PropTypes.func,
  buttonLoading: PropTypes.bool,
}
