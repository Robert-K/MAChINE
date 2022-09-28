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
import HelpPopper from '../components/shared/HelpPopper'
import HelpContext from '../context/HelpContext'
import { useNavigate } from 'react-router-dom'

export default function BaseModelsPage() {
  const [modelArray, setModelArray] = React.useState([])
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const help = React.useContext(HelpContext)

  React.useEffect(() => {
    api.getBaseModels().then((sentModels) => {
      setModelArray(sentModels)
    })
  }, [])

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
  const navigate = useNavigate()

  const handleClick = (baseModel) => {
    navigate('/models/model-config', { state: { baseModel } })
  }
  return (
    <Container>
      <Grid container spacing={4} marginTop={1} marginBottom={5}>
        {modelArray.map((baseModel) => (
          <BaseModelCard
            baseModel={baseModel}
            key={baseModel.id}
            clickFunc={handleClick}
            hoverFunc={(e) => {
              handleHelpPopperOpen(
                e,
                "Click here to select this base model. Don't worry, you'll get to configure its parameters on the next page!"
              )
            }}
            leaveFunc={handleHelpPopperClose}
          />
        ))}
      </Grid>
      <HelpPopper
        id="helpPopper"
        helpPopperContent={helpPopperContent}
        open={helpOpen}
        anchorEl={helpAnchorEl}
        onClose={handleHelpPopperClose}
      />
    </Container>
  )
}
