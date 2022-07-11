/**
 * This page is reached when clicking 'analyze' on a molecule.
 */

import React from 'react'
import { Container } from '@mui/material'
import Grid from '@mui/material/Grid'
import FittingCard from '../components/FittingCard'
import Fitting from '../internal/Fitting'
import Button from '@mui/material/Button'
import DetailsPopper from '../components/DetailsPopper'

export default function TrainedModels() {
  // Also code duplication from MoleculeSelection but I don't know what else to do
  const [open, setOpen] = React.useState(false)
  const [waited, setWaited] = React.useState(false)
  const [content, setContent] = React.useState(<h1>Placeholder</h1>)
  const [anchor, setAnchor] = React.useState(null)

  const handlePopper = (target, content, show) => {
    setContent(content)
    setAnchor(target)
    setOpen(show)
    setWaited(false)
    if (show) {
      setTimeout(() => {
        setWaited(true)
      }, 150)
    }
  }

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
                <Button variant="contained">Choose this model</Button>,
                event.currentTarget !== anchor || !open
              )
            }}
          />
        ))}
        <DetailsPopper
          anchor={anchor}
          open={open}
          content={content}
          waited={waited}
        />
      </Grid>
    </Container>
  )
}

// TODO: get fittings from models in model storage (where exactly is tbd)
const fitting0 = new Fitting('fitting0', 0, 10, 100, 5)

const fitting1 = new Fitting('fitting1', 1, 11, 1000, 100)

const fitting2 = new Fitting('fitting2', 2, 12, 10000, 50)

const fitting3 = new Fitting('fitting3', 3, 13, 300, 80)

const fitting4 = new Fitting('fitting4', 4, 14, 200, 3)

const fittingArray = [fitting0, fitting1, fitting2, fitting3, fitting4]
