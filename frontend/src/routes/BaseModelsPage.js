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
import api from '../api'
import PropTypes from 'prop-types'
import ModelConfigPage from './ModelConfigPage'

export default function BaseModelsPage({ addFunc }) {
  const [modelArray, setModelArray] = React.useState([])
  const [selectedModel, setSelectedModel] = React.useState(null)

  React.useEffect(() => {
    api.getBaseModels().then((sentModels) => {
      console.log(sentModels)
      setModelArray(sentModels)
    })
  }, [])

  const handleClick = (baseModel) => {
    setSelectedModel(baseModel)
  }

  if (selectedModel) {
    return <ModelConfigPage baseModel={selectedModel} addFunc={addFunc} />
  } else {
    return (
      <Container>
        <Grid container spacing={4} marginTop={1} marginBottom={5}>
          {modelArray.map((baseModel) => (
            <BaseModelCard
              baseModel={baseModel}
              key={baseModel.id}
              clickFunc={handleClick}
            />
          ))}
        </Grid>
      </Container>
    )
  }
}

BaseModelsPage.propTypes = {
  addFunc: PropTypes.func.isRequired,
}
