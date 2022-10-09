import React from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'

/**
 * Card displaying information for given fitting
 * @param fitting displayed fitting
 * @param clickFunc callback to handle a click on the card
 * @param hoverFunc callback for hovering
 * @param leaveFunc callback for mouse pointer leaving the card
 * @returns {JSX.Element}
 */
export default function FittingCard({
  fitting,
  clickFunc,
  hoverFunc,
  leaveFunc,
}) {
  return (
    <Grid item xs={4} md={3}>
      <Card>
        <CardActionArea
          onClick={(e) => {
            clickFunc(e)
          }}
          onMouseOver={(e) => hoverFunc(e)}
          onMouseLeave={() => leaveFunc()}
        >
          <CardContent>
            <CardHeader
              sx={{ p: 1, pl: 2 }}
              title={fitting.modelName}
              subheader={`Trained Model ID: ${fitting.id}`}
            />
            <Box paddingX={2}>
              <Typography variant="subtitle1" component="h4">
                Dataset: {fitting.datasetName} #{fitting.datasetID}
              </Typography>
              <Typography variant="subtitle1" component="h4">
                Epochs: {fitting.epochs}
              </Typography>
              <Typography variant="subtitle1" component="h4">
                Batch Size: {fitting.batchSize}
              </Typography>
              <Typography variant="subtitle1" component="h4">
                Accuracy (R²): {fitting.accuracy}%
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
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
}
