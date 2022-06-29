/**
 * This page is reached when creating a new model (by pressing the "add a model"
 * button on the page "models"). It shows the selectable base models in a grid-like
 * pattern, showing a name, image and base information for each base model.
 * Clicking on a base model leads the user to the model configuration.
 */

import React from 'react'
import { Grid, Box } from '@mui/material'
import MoleculeSelection from '../components/MoleculeSelection'

export default function BaseModels() {
  return (
    <>
      <Container></Container>
    </>
  )
}
