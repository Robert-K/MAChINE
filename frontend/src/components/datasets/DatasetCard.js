import React from 'react'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'

export default function DatasetCard({ dataset, doubleClickFunc, clickFunc }) {
  return (
    <Grid item xs={4} md={3}>
      <Card sx={{ maxWidth: 260 }}>
        <CardActionArea
          onDoubleClick={(e) => doubleClickFunc(e)}
          onClick={(e) => {
            clickFunc(e)
          }}
        >
          <CardMedia
            component="img"
            height="110"
            image="/dataset.jpeg"
            alt="data picture"
          />
          {/* TODO: Select a non-copyrighted image */}
          <CardContent>
            <Typography gutterBottom component="div">
              {dataset.name} #{dataset.datasetID}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Size: {dataset.size}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

DatasetCard.propTypes = {
  dataset: PropTypes.object.isRequired,
  doubleClickFunc: PropTypes.func.isRequired,
  clickFunc: PropTypes.func.isRequired,
}
