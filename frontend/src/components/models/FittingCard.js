import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { Box, CardActionArea, CardHeader, Typography } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import PropTypes from 'prop-types'

export default function FittingCard({ fitting, clickFunc }) {
  return (
    <Grid item xs={4} md={3}>
      <Card>
        <CardActionArea
          onClick={(e) => {
            clickFunc(e)
          }}
        >
          <CardContent>
            <CardHeader
              sx={{ p: 1, pl: 2 }}
              title={fitting.modelName}
              subheader={`ID: ${fitting.id}`}
            />
            <Box paddingX={2}>
              <Typography variant="subtitle1" component="h4">
                {/* TODO: display dataset's name instead. */}
                Training dataset: {fitting.datasetID}
              </Typography>
              <Typography variant="subtitle1" component="h4">
                Epochs: {fitting.epochs}
              </Typography>
              <Typography variant="subtitle1" component="h4">
                Batch Size: {fitting.batchSize}
              </Typography>
              <Typography variant="subtitle1" component="h4">
                Accuracy: {fitting.accuracy}
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
