/**
 * This page is reached when creating a new model (by pressing the "add a model"
 * button on the page "models"). It shows the selectable base models in a grid-like
 * pattern, showing a name, image and base information for each base model.
 * Clicking on a base model leads the user to the model configuration.
 */

import React from 'react'
import { Container, Popper } from '@mui/material'
import BaseModelCard from '../components/models/BaseModelCard'
import Grid from '@mui/material/Grid'
import api from '../api'
import PropTypes from 'prop-types'
import ModelConfigPage from './ModelConfigPage'
import HelpPopper from '../components/shared/HelpPopper'

export default function BaseModelsPage({ addFunc }) {
  const [modelArray, setModelArray] = React.useState([])
  const [selectedModel, setSelectedModel] = React.useState(null)
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')

  React.useEffect(() => {
    api.getBaseModels().then((sentModels) => {
      console.log(sentModels)
      setModelArray(sentModels)
    })
  }, [])

  const handleClick = (baseModel) => {
    setSelectedModel(baseModel)
  }
  const handleHelpPopperOpen = (event, content) => {
    setHelpAnchorEl(event.currentTarget)
    setHelpPopperContent(content)
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
    // setHelpPopperContent('')
  }

  const open = Boolean(helpAnchorEl)

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
              onMouseOver={(e) => {
                console.log('MouseOver')
                handleHelpPopperOpen(
                  e,
                  "Click here to select this base model. Don't worry, you'll get to configure its parameters on the next page!"
                )
              }}
              onMouseLeave={handleHelpPopperClose}
            />
          ))}
        </Grid>
        <Popper
          id="mouse-over-popper"
          sx={{
            pointerEvents: 'none',
            padding: 3,
          }}
          open={open}
          anchorEl={helpAnchorEl}
          placement={'right'}
          onClose={handleHelpPopperClose}
        >
          <HelpPopper id="helpPopper" helpPopperContent={helpPopperContent} />
        </Popper>
      </Container>
    )
  }
}

BaseModelsPage.propTypes = {
  addFunc: PropTypes.func,
}
