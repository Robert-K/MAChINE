/**
 * This page is reached when clicking 'analyze' on a molecule.
 */

import React from 'react'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
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

  const [analysis, setAnalysis] = React.useState('')

  const handleAnalysis = (response) => {
    setAnalysis(response)
  }

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
                      sx={{ mb: 1 }}
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
                    Labels: <br />
                    {/** todo might have to adjust the line breaks when we want to enable multi-label fittings */}
                    {fitting.labels.map((label) => {
                      return label
                    })}
                  </>,
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
      </Box>
    </Box>
  )
}
