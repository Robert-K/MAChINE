import React from 'react'
import { Box, Card, CardContent, ListItem, Typography } from '@mui/material'
import ModelConfig from '../../internal/ModelConfig'
import PropTypes from 'prop-types'
import { camelToNaturalString } from '../../utils'

export default function ModelDetailsCard({
  selectedModel,
  hoverFunc,
  leaveFunc,
}) {
  return (
    <Card
      sx={{ m: 3 }}
      onMouseOver={(e) => {
        hoverFunc(e)
      }}
      onMouseLeave={leaveFunc}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Model Details
        </Typography>
        <Typography>Name: {selectedModel.name}</Typography>
        <Typography>Base Model: {selectedModel.baseModelName}</Typography>
        <Typography>Parameters: </Typography>
        {Object.entries(selectedModel.parameters).map(
          ([valueName, value], index) => {
            return (
              <ListItem key={index} sx={{ py: 0.1, display: 'inline-block' }}>
                {valueName === 'layers' ? (
                  <SmallLayerVisual layers={value} />
                ) : (
                  `${camelToNaturalString(valueName)}: ${JSON.stringify(value)}`
                )}
              </ListItem>
            )
          }
        )}
      </CardContent>
    </Card>
  )
}

ModelDetailsCard.propTypes = {
  selectedModel: PropTypes.object,
  hoverFunc: PropTypes.func,
  leaveFunc: PropTypes.func,
}

ModelDetailsCard.defaultProps = {
  selectedModel: new ModelConfig('ERROR', 'ERROR', 'ERROR', {}, []),
}

function SmallLayerVisual({ layers }) {
  return (
    <>
      {layers.map((layer, index) => {
        return (
          <Box
            key={index}
            sx={{
              display: 'inline-flex',
              height: '100%',
              lineHeight: 4,
              position: 'relative',
            }}
          >
            {index === 0 ? 'Layer: [' : null}
            {index !== 0 ? 'X' : null}
            <Box
              sx={{
                borderStyle: 'solid',
                borderWidth: 1,
                borderRadius: 1,
                textAlign: 'center',
                lineHeight: 'normal',
                m: 1,
                p: 0.5,
              }}
            >
              {layer.units}
              <br />
              {layer.activation}
            </Box>

            {index === layers.length - 1 ? ']' : null}
          </Box>
        )
      })}
    </>
  )
}

SmallLayerVisual.propTypes = {
  layers: PropTypes.array,
}
