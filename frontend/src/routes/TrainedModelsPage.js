/**
 * This page is reached when clicking 'analyze' on a molecule.
 */

import React from 'react'
import { Container } from '@mui/material'
import Grid from '@mui/material/Grid'
import FittingCard from '../components/FittingCard'
import Button from '@mui/material/Button'
import DetailsPopper from '../components/DetailsPopper'
import api from '../api'
import UserContext from '../UserContext'

export default function TrainedModelsPage() {
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

  prepareContent()

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
                <Button fullWidth variant="contained">
                  Choose this model
                </Button>,
                event.currentTarget !== anchor || !open
              )
            }}
          />
        ))}
        <DetailsPopper
          anchor={anchor}
          open={open}
          content={content}
          animate={waited}
        />
      </Grid>
    </Container>
  )
}

const fittingArray = []

function prepareContent() {
  const [modelList, setModelList] = React.useState([])

  const user = React.useContext(UserContext)

  React.useEffect(() => {
    api.getModelList(user.userID).then((models) => setModelList(models))
  }, [user])

  let counter = 0
  for (let i = 0; i < modelList.length; i++) {
    for (let j = 0; j < modelList[i].fittings.length; j++) {
      fittingArray[counter] = modelList[i].fittings[j]
      counter++
    }
  }
}
