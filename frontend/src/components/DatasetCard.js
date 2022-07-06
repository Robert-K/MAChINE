import React from 'react'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Grid,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'

export default function DatasetCard(props) {
  return (
    <Grid item xs={4} md={3}>
      <Card sx={{ maxWidth: 260 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="110"
            image="/dataset.jpg"
            alt="data picture"
          />
          {/* TODO: Select an non-copyrighted image */}
          <CardContent>
            <Typography gutterBottom component="div">
              {props.dataset.name} #{props.dataset.datasetID}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Box>Size: {props.dataset.size}</Box>
              {props.dataset.labelDescriptors.map((descriptor, index) => {
                return <Box key={index}>{descriptor}</Box>
              })}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

DatasetCard.propTypes = {
  dataset: PropTypes.object.isRequired,
}
