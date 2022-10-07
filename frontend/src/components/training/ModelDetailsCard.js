import React from 'react'
import { Box, Card, CardContent, ListItem, Typography } from '@mui/material'
import ModelConfig from '../../internal/ModelConfig'
import PropTypes from 'prop-types'
import { camelToNaturalString } from '../../utils'

/**
 * A card shown on the trainings page, detailing the model to be trained.
 * @param selectedModel The respective model
 * @param hoverFunc Callback function for onMouseOver
 * @param leaveFunc Callback function for onMouseLeave
 * @returns {JSX.Element} A card listing this model's name, base model, and parameters (loss and optimizer for all models. Additionally, layers for MLPs, and embedding dimension, readout size and depth for schnets.)
 * @constructor
 */
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
  selectedModel: new ModelConfig('ERROR', 'ERROR', 'ERROR', 'ERROR', {}, []),
}

/**
 * Used for MLPs. A small rendition of the model's layers (size and activation function)
 * @param layers The model's configuration of its layers
 * @returns {JSX.Element} A representation of the layers. Each layer gets a rectangle with its nodes and its activation function, and between two layers is an X.
 * @constructor
 */
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
            {index === 0 ? 'Layer: [' : 'X'}
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
