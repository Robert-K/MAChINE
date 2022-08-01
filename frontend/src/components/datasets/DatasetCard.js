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

export default function DatasetCard(props) {
  return (
    <Grid item xs={4} md={3}>
      <Card sx={{ maxWidth: 260 }}>
        <CardActionArea
          onDoubleClick={(e) => props.doubleClickFunc(e)}
          onClick={(e) => {
            props.clickFunc(e)
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
              {props.dataset.name} #{props.dataset.datasetID}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Size: {props.dataset.size}
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
