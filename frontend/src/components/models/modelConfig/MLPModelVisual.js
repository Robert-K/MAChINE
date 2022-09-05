import { Card, CardContent, Popper, useTheme } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'
import * as vis from 'vis-data'
import * as v from 'vis-network'
import LayerConfigPopup from './LayerConfigPopup'
import Layer from '../../../internal/Layer'

export default function ModelVisual({ model, defaultActivation }) {
  const [open, setOpen] = React.useState(false)
  const [offset, setOffset] = React.useState([0, 0])
  const [insertionIndex, setInsertionIndex] = React.useState(null)
  const [layers, setLayers] = React.useState(model.layers)
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
    red: 'rgba(255, 0, 0, 1)',
    blue: 'rgba(0, 255, 0, 1)',
    green: 'rgba(0, 0, 255, 1)',
  }
  const colors = ['red', 'blue', 'green']
  // TODO: style: node opacity, pick colors, make boxes pretty
  // TODO: fix dark mode interaction
  // TODO: add layer box labels

  React.useEffect(() => {
    const graph = fillGraph()
    const container = document.getElementById('network')
    const network = new v.Network(container, graph, options)
    network.on('beforeDrawing', (ctx) => beforeDraw(ctx, network))
    network.on('doubleClick', (eventProps) =>
      onDoubleClick(eventProps, network, graph)
    )
  }, [options, layers])

  /**
   * Handles double click on network canvas
   * does nothing if:
   *   left of first or right of last layer, or if
   *   a configuration is already in progress
   * calculates insertionIndex
   * triggers popup for layer configuration
   * @param eventProps click event with extra canvas props
   * @param network network of nodes
   * @param graph depicted in network
   */
  function onDoubleClick(eventProps, network, graph) {
    const clickPos = eventProps.pointer.canvas
    if (
      clickPos.x < network.getPosition('0.1').x ||
      clickPos.x > network.getPosition(`${layers.length - 1}.1`).x ||
      open
    ) {
      return
    }
    // calculate insertionIndex
    let lastLeftNode
    Object.entries(network.getPositions()).every(([node, pos]) => {
      if (pos.x > clickPos.x) {
        return false
      }
      lastLeftNode = node
      return true
    })
    setInsertionIndex(parseInt(graph.nodes.get(lastLeftNode).group))

    // Popper handling, calculate offset and open
    const canvasRect = document
      .getElementById('network')
      .getBoundingClientRect()
    const distance = eventProps.pointer.DOM.x - canvasRect.width
    const skidding = -eventProps.pointer.DOM.y
    setOffset([distance, skidding])
    setOpen(true)
  }

  function beforeDraw(ctx, network) {
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
      // TODO: find html canvas shape library, this here is trash
    })
  }

  function fillGraph() {
    const graph = {
      nodes: new vis.DataSet({}),
      edges: new vis.DataSet({}),
    }
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
    return graph
  }

  /**
   * adds given layer to layers at insertionIndex
   * @param layer to be inserted
   **/
  function addLayer(layer) {
    if (insertionIndex !== undefined) {
      setLayers((layers) => [
        ...layers.slice(0, insertionIndex + 1),
        layer,
        ...layers.slice(insertionIndex + 1, layers.length),
      ])
    }
  }

  function configureLayer(units, activation) {
    addLayer(new Layer('Dense', units, activation))
    setOpen(false)
  }

  function cancelConfig() {
    setOpen(false)
  }

  return (
    <Card sx={{ m: 2 }}>
      <CardContent
        sx={{
          border: '1px',
          borderColor: theme.palette.primary.main,
          width: '100%',
        }}
      >
        <div id="network" style={{ height: '80vh' }}></div>
        <Popper
          id="popper"
          open={open}
          anchorEl={document.getElementById('network')}
          placement="top-end"
          modifiers={[
            {
              name: 'offset',
              enabled: true,
              options: {
                offset,
              },
            },
          ]}
        >
          <LayerConfigPopup
            id="LayerConfig"
            passConfig={configureLayer}
            cancelConfig={cancelConfig}
            defaultActivation={defaultActivation}
          />
        </Popper>
      </CardContent>
    </Card>
  )
}

ModelVisual.propTypes = {
  model: PropTypes.object.isRequired,
  defaultActivation: PropTypes.string,
}
