/**
 * This page is reached when creating a new model (by pressing the "add a model"
 * button on the page "models"). It shows the selectable base models in a grid-like
 * pattern, showing a name, image and base information for each base model.
 * Clicking on a base model leads the user to the model configuration.
 */

import React from 'react'
import { Container } from '@mui/material'
import BaseModelCard from '../components/BaseModelCard'
import BaseModel from '../internal/BaseModel'
import ModelType from '../internal/ModelType'
import Grid from '@mui/material/Grid'
import DetailsPopper from '../components/DetailsPopper'
import PropTypes from 'prop-types'
import BaseModelInfo from '../components/BaseModelInfo'
import Dataset from '../internal/Dataset'

// Note for future reference: CSS transform is good for doing things like making
// the card bigger when the popper is shown. Currently not implemented because
// it was not deemed sufficiently important

export default function BaseModels() {
  /* Buncha duplicated code from MoleculeSelection. Might want to fix that at some point */
  // const [selectedIndex, setSelectedIndex] = React.useState('a')
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

  const handleListItemClick = (event, index) => {
    // setSelectedIndex(index)
    handlePopper(null, <div />, false)
  }

  return (
    <Container>
      <Grid container spacing={4} marginTop={1} marginBottom={5} md={3}>
        {modelArray.map((baseModel) => (
          <BaseModelCard
            baseModel={baseModel}
            key={baseModel.id}
            /* Der Index, der bei handleListItemClick als zweites Argument übergeben wird, bestimmt, was beim Auftauchen des Poppers gehighlighted wird.
            I think */
            doubleClickFunc={(event) => {
              console.log('double click timeee')
              handleListItemClick(event, baseModel.name)
            }}
            clickFunc={(event) => {
              console.log('all the single clickies')
              handlePopper(
                event.currentTarget,
                <BaseModelInfo
                  baseModel={baseModel}
                  key={baseModel.id}
                ></BaseModelInfo>,
                event.currentTarget !== anchor || !open
              )
            }}
            // selected={selectedIndex === baseModel.name}
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

BaseModels.propTypes = {
  baseModels: PropTypes.array,
}

// These constants are for testing purposes and should be removed as soon as real data becomes available.

const zieselType = new ModelType('Ziesel sind Hörnchen.', 'ziesel_content2.jpg')
const squirrelType = new ModelType(
  'Eichhörnchen sind Hörnchen.',
  'squirrel_content.jpg'
)
const quokkaType = new ModelType(
  'Quokkas sind Beutelbeutelbeutelbeuteltiere.',
  'quokka_content2.webp'
)

const dataset1 = new Dataset('dataset1', 1, 200, [
  'Attribute1a',
  'Attribute1b',
  'Attribute1c',
])

const dataset2 = new Dataset('dataset2', 2, 500, ['Attribute2a', 'Attribute2b'])

const modelA = new BaseModel('modelA', 0, zieselType, 'Regression', [dataset1])
const modelB = new BaseModel('modelB', 1, squirrelType, 'Regression', [
  dataset1,
  dataset2,
])
const modelC = new BaseModel('modelC', 2, zieselType, 'Classifier', [])
const modelD = new BaseModel('modelD', 3, quokkaType, 'Regression', [])
const modelE = new BaseModel('modelE', 4, squirrelType, 'Classifier', [])
const modelF = new BaseModel('modelF', 5, zieselType, 'Classifier', [])
const modelG = new BaseModel('modelG', 6, quokkaType, 'Regression', [])
const modelH = new BaseModel('modelH', 7, squirrelType, 'Regression', [])

const modelArray = [
  modelA,
  modelB,
  modelC,
  modelD,
  modelE,
  modelF,
  modelG,
  modelH,
]
