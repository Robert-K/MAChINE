import React from 'react'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Typography, Box } from '@mui/material'
import PropTypes from 'prop-types'

// Author's note: Work in progress because representation of base models isn't final yet

function BaseModelCard(props) {
  // ({ baseModel }) {
  return (
    <Grid item xs={3}>
      {/* ^ The grid has a total width of  12. The xs defines how much of that width each component of the grid gets,
      and as such also how many elements each row of the grid can fit. If xs=3, then four elements can fit in one
       row of width 3*4=12 */}
      {/* The elevation describes how much each paper sets itself apart from the background (if using light mode,
       this boils down to the shadow beneath the paper */}
      <Paper elevation="4">
        <img
          /* Shows an image of the base model. What image is used is determined by the model's type. */
          /* TODO figure out how to get the image from the type */
          src={props.baseModel.image}
          alt="You should see a base model here."
          className="img"
        />
        <Box paddingX={1}>
          {/* Displays the base model's name */}
          <Typography variant="h2" component="h2">
            {props.baseModel.name}
          </Typography>
        </Box>
        <Box>
          {/* Displays the base model's type */}
          <Typography variant="subtitle1" component="h4">
            {props.baseModel.type}
          </Typography>
        </Box>
        <Box>
          {/* Displays the base model's taskType (classifier or regression) */}
          <Typography variant="subtitle1" component="h4">
            {props.baseModel.taskType}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  )
}

BaseModelCard.propTypes = {
  baseModel: PropTypes.object.isRequired,
}

export default BaseModelCard
