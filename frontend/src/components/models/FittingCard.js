import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import {
  Box,
  CardActionArea,
  CardContent,
  CardHeader,
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
              subheader={`ID: ${fitting.id}`}
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
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
}
