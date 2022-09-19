/**
 * This page is reached when clicking 'analyze' on a molecule.
 */

import React from 'react'
import { Container } from '@mui/material'
import Grid from '@mui/material/Grid'
import FittingCard from '../components/models/FittingCard'
import Button from '@mui/material/Button'
import DetailsPopper from '../components/shared/DetailsPopper'
import api from '../api'
import UserContext from '../context/UserContext'
import { useLocation } from 'react-router-dom'
import HelpContext from '../context/HelpContext'
import HelpPopper from '../components/shared/HelpPopper'

export default function FittingsPage() {
  const [fittingArray, setFittingArray] = React.useState([])
  const { state } = useLocation()
  const { selectedSmiles } = state
  console.log(selectedSmiles)
  const user = React.useContext(UserContext)

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

  const handleHelpPopperOpen = (event, content) => {
    setHelpAnchorEl(event.currentTarget)
    setHelpPopperContent(content)
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
  }

  const helpOpen = Boolean(helpAnchorEl)

  return (
    <Container>
      <Grid container spacing={4} marginTop={1} marginBottom={5}>
        {fittingArray.map((fitting) => (
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
                    api
                      .analyzeMolecule(fitting.id, selectedSmiles)
                      .then((response) => {
                        console.log(response)
                      })
                  }}
                >
                  Choose this model
                </Button>,
                event.currentTarget !== anchor || !open
              )
            }}
            hoverFunc={(e) => {
              if (help.helpMode) {
                handleHelpPopperOpen(
                  e,
                  'Click to analyze your molecule with this model!'
                )
              }
            }}
            leaveFunc={handleHelpPopperClose}
          />
        ))}
        <DetailsPopper anchor={anchor} open={open} content={content} />
        <HelpPopper
          id="helpPopper"
          helpPopperContent={helpPopperContent}
          open={helpOpen}
          anchorEl={helpAnchorEl}
          onClose={handleHelpPopperClose}
        />
      </Grid>
    </Container>
  )
}
