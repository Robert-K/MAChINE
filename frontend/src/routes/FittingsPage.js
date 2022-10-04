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
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'

export default function FittingsPage() {
  const [fittingArray, setFittingArray] = React.useState([])
  const { state } = useLocation()
  const { selectedSmiles } = state
  const user = React.useContext(UserContext)
  const theme = useTheme()
  const navigate = useNavigate()

  React.useEffect(() => {
    api.getFittings().then((fittings) => setFittingArray(fittings))
  }, [user])

  const [open, setOpen] = React.useState(false)
  const [content, setContent] = React.useState(<h1>Placeholder</h1>)
  const [anchor, setAnchor] = React.useState(null)
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)

  const handlePopper = (target, content, show) => {
    setContent(content)
    setAnchor(target)
    setOpen(show)
  }

  const [openDialog, setOpenDialog] = React.useState(false)

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

  const [analysis, setAnalysis] = React.useState('')

  const handleAnalysis = (response) => {
    setAnalysis(response)
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
                        onClick={() => {
                          api
                            .analyzeMolecule(fitting.id, selectedSmiles)
                            .then((response) => {
                              handleAnalysis(`${Object.entries(response)}`)
                              handleClickOpenDialog()
                            })
                        }}
                      >
                        Choose this model
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

              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {'You successfully analyzed your molecule!'}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {`Result: ${analysis}`}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Remain here</Button>
                  <Button onClick={handleGoToMol} autoFocus>
                    Go to Molecules
                  </Button>
                </DialogActions>
              </Dialog>
            </React.Fragment>
          ))}
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
