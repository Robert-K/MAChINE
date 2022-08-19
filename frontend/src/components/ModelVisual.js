import { Card, CardContent, useTheme } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'
import * as vis from 'vis-data'
import * as v from 'vis-network'

export default function ModelVisual(props) {
  const [layers] = React.useState(props.model.layers)
  const [graph] = React.useState({
    nodes: new vis.DataSet([]),
    edges: new vis.DataSet({}),
  })
  const [options] = React.useState({
    nodes: {
      borderWidth: 2,
    },
    groups: {},
    layout: {
      hierarchical: {
        direction: 'LR',
        nodeSpacing: 70,
        levelSeparation: 200,
        sortMethod: 'directed',
      },
    },
  })

  const theme = useTheme()
  const layerBorderColors = {
    red: 'rgb(255, 0, 0)',
    blue: 'rgb(0, 255, 0)',
    green: 'rgb(0, 0, 255)',
  }
  const layerBackgroundColors = {
    red: 'rgba(255, 0, 0, 0.3)',
    blue: 'rgba(0, 255, 0, 0.3)',
    green: 'rgba(0, 0, 255, 0.3)',
  }
  const colors = ['red', 'blue', 'green']
  // TODO: style: opacity, border, color, shape, shadow, image
  // TODO: make add-node appear on hover between layers
  // TODO: update graph when adding layers

  React.useEffect(() => {
    const container = document.getElementById('network')
    const network = new v.Network(container, graph, options)
    network.on('beforeDrawing', (ctx) => {
      layers.forEach((layer, index) => {
        const topNodePos = network.getPosition(`${index}.1`)
        const lowestNodePos = network.getPosition(`${index}.${layer.units}`)
        ctx.strokeStyle = Object.values(options.groups)[index].color.border
        ctx.beginPath()
        ctx.rect(
          topNodePos.x - 50,
          topNodePos.y - 50,
          100,
          lowestNodePos.y - topNodePos.y + 100
        )
        ctx.closePath()
        ctx.stroke()
      })
    })
  }, [])

  function fillGraph() {
    const nodesByLayer = []
    const newEdges = []
    // const newOptions = Object.assign({}, options)
    layers.forEach((layer, index) => {
      // add new group for layer
      options.groups[index.toString()] = {
        color: {
          background: layerBackgroundColors[colors[index % colors.length]],
          border: layerBorderColors[colors[index % colors.length]],
        },
      }
      const graphLayer = []
      if (layer.units < 10) {
        for (let i = 1; i <= layer.units; i++) {
          // add nodes to layer
          graphLayer.push({
            id: `${index}.${i}`,
            label: `${i}`,
            group: index.toString(),
          })
        }
      } else {
        graphLayer.push({
          id: `${index}.1`,
          label: '1',
          group: index.toString(),
        })
        graphLayer.push({
          id: `${index}.${2}`,
          label: 'nodes',
          group: index.toString(),
          shape: 'image',
          // TODO: toggle white/black dots and node color with dark/light theme
          image: 'http://127.0.0.1:3000/more_vert.svg',
        })
        graphLayer.push({
          id: `${index}.${layer.units}`,
          label: layer.units.toString(),
          group: index.toString(),
        })
      }
      nodesByLayer.push(graphLayer)
      if (index > 0) {
        nodesByLayer[index - 1].forEach((sourceNode) => {
          nodesByLayer[index].forEach((targetNode) => {
            newEdges.push({ from: sourceNode.id, to: targetNode.id })
          })
        })
      }
    })
    nodesByLayer.forEach((layer) => {
      graph.nodes.add(layer)
    })
    graph.edges.add(newEdges)
  }

  /**
   * creates string representation of given layer
   * @param layer consisting of units, type and activation
   * @returns {string}

  const layerToString = (layer) => {
    let textualRep = `${layer.type}\n${layer.units} units`
    if (layer.activation) {
      textualRep = textualRep.concat('\n', `${layer.activation}-activation`)
    }
    return textualRep
  }
   */

  /**
   * adds given layer to layers at index
   * can't replace first or last layer
   * @param layer to be inserted
   * @param index of added layer after insertion

  const addLayer = (layer, index) => {
    if (index && index > 0 && index < layers.length() - 1) {
      setLayers(layers.splice(index, 0, layer))
    }
  }
   */

  fillGraph()

  return (
    <Card>
      <CardContent
        sx={{
          border: '1px',
          borderColor: theme.palette.primary.main,
          width: '100%',
        }}
      >
        <div id="network" style={{ height: '80vh' }}></div>
      </CardContent>
    </Card>
  )
}

ModelVisual.propTypes = {
  model: PropTypes.object,
}