import React from 'react'
import Grid from '@mui/material/Grid'
import { Typography, Box, CardActionArea, useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

/**
 * A base model card is utilized in the process of the user creating a model.
 * It displays one base model's name, image, and basic information.
 * @param baseModel The data from a base model
 * @param clickFunc callback for onClick
 * @param hoverFunc callback for onMouseOver
 * @param leaveFunc callback for onMouseLeave
 * @returns {JSX.Element} The the element for the website.
 * @constructor
 */

export default function BaseModelCard({
  baseModel,
  clickFunc,
  hoverFunc,
  leaveFunc,
}) {
  const theme = useTheme()

  return (
    <Grid item xs={4} md={3}>
      {/* ^ The grid has a total width of  12. The xs defines how much of that width each component of the grid gets,
      and as such also how many elements each row of the grid can fit. If xs=3, then four elements can fit in one
       row of width 3*4=12 */}
      <Card>
        <CardActionArea
          onClick={() => clickFunc(baseModel)}
          onMouseOver={(e) => hoverFunc(e)}
          onMouseLeave={() => leaveFunc()}
        >
          <Box position="relative">
            <Box
              sx={{
                height: '155px',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundImage: `url("/models/network${
                  baseModel.id % 5
                }.png")`,
                filter: 'grayscale(100%)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
                backgroundColor: theme.palette.primary.overlay,
                opacity: 1,
                mixBlendMode: 'hard-light',
              }}
            />
          </Box>
          <CardContent>
            <Box paddingX={1}>
              {/* Displays the base model's name */}
              <Typography variant="h4" component="h3">
                {baseModel.name}
              </Typography>
              {/* Displays the base model's type */}
              <Typography variant="subtitle1" component="h4">
                Type: {baseModel.type.name}
              </Typography>
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
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
}
