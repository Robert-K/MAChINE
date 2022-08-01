import React from 'react'
import Grid from '@mui/material/Grid'
import { Typography, Box, CardActionArea } from '@mui/material'
import PropTypes from 'prop-types'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useNavigate } from 'react-router-dom'

/**
 * A base model card is utilized in the process of the user creating a model.
 * It displays one base model's name, image, and basic information.
 * @param baseModel The data from a base model
 * @param clickFunc The function that executes when card is clicked
 * @returns {JSX.Element} The the element for the website.
 * @constructor
 */

export default function BaseModelCard({ baseModel }) {
  const navigate = useNavigate()
  return (
    <Grid item xs={4} md={3}>
      {/* ^ The grid has a total width of  12. The xs defines how much of that width each component of the grid gets,
      and as such also how many elements each row of the grid can fit. If xs=3, then four elements can fit in one
       row of width 3*4=12 */}
      <Card>
        <CardActionArea
          onDoubleClick={(e) => {
            navigate('/modelconfig')
          }}
        >
          <CardContent>
            <img
              /* Shows an image of the base model. What image is used is determined by the model's type.
               * todo: Images currently get squashed when website is less wide (like when opening F12).
               *  might wanna fix that. */
              src={baseModel.type.image}
              height="155px"
              alt="You should see a base model here."
              className="img"
            />
            <Box paddingX={1}>
              {/* Displays the base model's name */}
              <Typography variant="h4" component="h3">
                {baseModel.name}
              </Typography>
            </Box>
            <Box paddingX={1}>
              {/* Displays the base model's type */}
              <Typography variant="subtitle1" component="h4">
                {baseModel.type.name}
              </Typography>
            </Box>
            <Box paddingX={1}>
              {/* Displays the base model's taskType (classifier or regression) */}
              <Typography variant="subtitle1" component="h4">
                Model task: {baseModel.taskType}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

BaseModelCard.propTypes = {
  baseModel: PropTypes.object.isRequired,
  clickFunc: PropTypes.func.isRequired,
}
