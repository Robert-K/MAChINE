import React from 'react'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'

export default function DatasetCard({
  dataset,
  doubleClickFunc,
  clickFunc,
  hoverFunc,
  leaveFunc,
}) {
  return (
    <Card>
      <CardActionArea
        onDoubleClick={(e) => doubleClickFunc(e)}
        onClick={(e) => {
          clickFunc(e)
        }}
        onMouseOver={(e) => {
          hoverFunc(e)
        }}
        onMouseLeave={leaveFunc}
      >
        <CardMedia
          component="img"
          height="110"
          src={`data:image/png;base64,${dataset.image}`}
          alt="You should see a dataset picture here."
        />
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
  )
}

DatasetCard.propTypes = {
  dataset: PropTypes.object.isRequired,
  doubleClickFunc: PropTypes.func.isRequired,
  clickFunc: PropTypes.func.isRequired,
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
}
