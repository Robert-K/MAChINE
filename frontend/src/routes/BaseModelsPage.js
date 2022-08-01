/**
 * This page is reached when creating a new model (by pressing the "add a model"
 * button on the page "models"). It shows the selectable base models in a grid-like
 * pattern, showing a name, image and base information for each base model.
 * Clicking on a base model leads the user to the model configuration.
 */

import React from 'react'
import { Container } from '@mui/material'
import BaseModelCard from '../components/models/BaseModelCard'
import Grid from '@mui/material/Grid'
import PropTypes from 'prop-types'
import api from '../api'

export default function BaseModelsPage() {
  const [modelArray, setModelArray] = React.useState([])

  React.useEffect(() => {
    api.getBaseModels().then((sentModels) => {
      console.log(sentModels)
      setModelArray(sentModels)
    })
  }, [])

  return (
    <Container>
      <Grid container spacing={4} marginTop={1} marginBottom={5}>
        {modelArray.map((baseModel) => (
          <BaseModelCard baseModel={baseModel} key={baseModel.id} />
        ))}
      </Grid>
    </Container>
  )
}

BaseModelsPage.propTypes = {
  baseModels: PropTypes.array,
}
