/**
 * This page is reached when clicking 'analyze' on a molecule.
 */

import React from 'react'
import {
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import FittingCard from '../components/models/FittingCard'
import Button from '@mui/material/Button'
import DetailsPopper from '../components/shared/DetailsPopper'
import api from '../api'
import UserContext from '../context/UserContext'
import { useLocation, useNavigate } from 'react-router-dom'

export default function FittingsPage() {
  const [fittingArray, setFittingArray] = React.useState([])
  const { state } = useLocation()
  const { selectedSmiles } = state
  const user = React.useContext(UserContext)

  React.useEffect(() => {
    api.getFittings().then((fittings) => setFittingArray(fittings))
  }, [user])

  const [open, setOpen] = React.useState(false)
  const [content, setContent] = React.useState(<h1>Placeholder</h1>)
  const [anchor, setAnchor] = React.useState(null)

  const handlePopper = (target, content, show) => {
    setContent(content)
    setAnchor(target)
    setOpen(show)
  }
  const navigate = useNavigate()

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

  let analysisKey

  return (
    <Container>
      <Grid container spacing={4} marginTop={1} marginBottom={5}>
        {fittingArray.map((fitting) => (
          <div key={fitting.id}>
            <FittingCard
              fitting={fitting}
              key={fitting.id}
              clickFunc={(event) => {
                handlePopper(
                  event.currentTarget,
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      handleClickOpenDialog()
                      api
                        .analyzeMolecule(fitting.id, selectedSmiles)
                        .then((response) => {
                          console.log(response)
                          analysisKey = response
                        })
                    }}
                  >
                    Choose this model
                  </Button>,
                  event.currentTarget !== anchor || !open
                )
              }}
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
                  {analysisKey}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Remain on this page</Button>
                <Button onClick={handleGoToMol} autoFocus>
                  Go back to Molecules Page
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        ))}
        <DetailsPopper anchor={anchor} open={open} content={content} />
      </Grid>
    </Container>
  )
}
