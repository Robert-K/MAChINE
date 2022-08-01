/**
 * This page is reached when creating a new model (by pressing the "add a model"
 * button on the page "models"). It shows the selectable base models in a grid-like
 * pattern, showing a name, image and base information for each base model.
 * Clicking on a base model leads the user to the model configuration.
 */

import React from 'react'
import { Container } from '@mui/material'
import BaseModelCard from '../components/BaseModelCard'
import Grid from '@mui/material/Grid'
import DetailsPopper from '../components/DetailsPopper'
import PropTypes from 'prop-types'
import BaseModelInfo from '../components/BaseModelInfo'
import api from '../api'

export default function BaseModelsPage() {
  const [open, setOpen] = React.useState(false)
  const [waited, setWaited] = React.useState(false)
  const [content, setContent] = React.useState(<h1>Placeholder</h1>)
  const [anchor, setAnchor] = React.useState(null)
  const [modelArray, setModelArray] = React.useState([])

  React.useEffect(() => {
    api.getBaseModels().then((sentModels) => {
      console.log(sentModels)
      setModelArray(sentModels)
    })
  }, [])

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
        {modelArray.map((baseModel) => (
          <BaseModelCard
            baseModel={baseModel}
            key={baseModel.id}
            clickFunc={(event) => {
              handlePopper(
                event.currentTarget,
                <BaseModelInfo
                  baseModel={baseModel}
                  key={baseModel.id}
                ></BaseModelInfo>,
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

BaseModelsPage.propTypes = {
  baseModels: PropTypes.array,
}
