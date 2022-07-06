import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { Box, CardActionArea, Typography } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import PropTypes from 'prop-types'

function FittingCard(props) {
  return (
    <Grid item xs={4} md={3}>
      <Card>
        <CardActionArea
          onClick={(e) => {
            props.clickFunc(e)
          }}
        >
          <CardContent>
            <Box paddingX={1}>
              <Typography variant="h4" component="h3">
                {props.fitting.name}
              </Typography>
            </Box>
            <Box paddingX={1}>
              <Typography variant="subtitle1" component="h4">
                Training dataset: {props.fitting.datasetID}
              </Typography>
            </Box>
            <Box paddingX={1}>
              <Typography variant="subtitle1" component="h4">
                Epochs: {props.fitting.epochs}
              </Typography>
            </Box>
            <Box paddingX={1}>
              <Typography variant="subtitle1" component="h4">
                Accuracy: {props.fitting.accuracy}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

FittingCard.propTypes = {
  fitting: PropTypes.object.isRequired,
  clickFunc: PropTypes.func.isRequired,
}

export default FittingCard
