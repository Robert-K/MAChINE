import { Popper, useTheme } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'
import * as vis from 'vis-data'
import * as v from 'vis-network'
import LayerConfigPopup from './LayerConfigPopup'
import Layer from '../../../internal/Layer'

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(
  ctx,
  x,
  y,
  width,
  height,
  radius = 5,
  fill = false,
  stroke = true
) {
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius }
  } else {
    radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius }
  }
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
  ctx.shadowBlur = 40
  ctx.beginPath()
  ctx.moveTo(x + radius.tl, y)
  ctx.lineTo(x + width - radius.tr, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  ctx.lineTo(x + width, y + height - radius.br)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
  ctx.lineTo(x + radius.bl, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  ctx.lineTo(x, y + radius.tl)
  ctx.quadraticCurveTo(x, y, x + radius.tl, y)
  ctx.closePath()
  if (fill) {
    ctx.fill()
  }
  if (stroke) {
    ctx.stroke()
  }
  ctx.shadowColor = 'rgba(0, 0, 0, 0)'
}

export default function MLPModelVisual({
  modelLayers,
  defaultActivation,
  updateFunc,
}) {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [offset, setOffset] = React.useState([0, 0])
  const [insertionIndex, setInsertionIndex] = React.useState(-1)
  const [visualizedLayers, setVisualizedLayers] = React.useState(
    [{ type: 'Dense', units: 1 }].concat(modelLayers)
  )
  const [options] = React.useState({
    nodes: {
      borderWidth: 2,
      font: {
        face: 'Poppins',
        color: 'black',
        size: 20,
        vadjust: 3,
      },
      shape: 'box',
      size: 39,
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

  // TODO: [optional] onSelectNode -> LayerConfigPopup to change unitCount/activation

  React.useEffect(() => {
    console.log(visualizedLayers)
    const graph = fillGraph()
    const container = document.getElementById('network')
    const network = new v.Network(container, graph, options)
    network.on('beforeDrawing', (ctx) => beforeDraw(ctx, network))
    network.on('doubleClick', (eventProps) =>
      onDoubleClick(eventProps, network, graph)
    )
  }, [options, visualizedLayers, theme.darkMode])

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
      clickPos.x > network.getPosition(`${visualizedLayers.length - 1}.1`).x ||
      open
    ) {
      return
    }
    // calculate insertionIndex
    let lastLeftNode
    Object.entries(network.getPositions()).every(([node, pos]) => {
      if (pos.x > clickPos.x) {
        setInsertionIndex(parseInt(graph.nodes.get(node).group))
        return false
      }
      return true
    })

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
    ctx.font = '18px Poppins'
    ctx.textAlign = 'center'
    visualizedLayers.forEach((layer, index) => {
      const topNodePos = network.getPosition(`${index}.1`)
      const lowestNodePos = network.getPosition(`${index}.${layer.units}`)
      ctx.strokeStyle = theme.modelVisual.borderColor
      ctx.fillStyle = theme.modelVisual.backgroundColor
      roundRect(
        ctx,
        topNodePos.x - 50,
        topNodePos.y - 50,
        100,
        lowestNodePos.y - topNodePos.y + 100,
        7,
        true,
        true
      )
      if (layer.activation) {
        ctx.fillStyle = theme.modelVisual.fontColor
        ctx.fillText(layer.activation, topNodePos.x, topNodePos.y - 60)
      }
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
    visualizedLayers.forEach((layer, index) => {
      // add new group for layer
      const graphLayer = []
      if (layer.units < 10) {
        for (let i = 1; i <= layer.units; i++) {
          // add nodes to layer
          graphLayer.push({
            id: `${index}.${i}`,
            label: index === 0 ? 'Input' : `${i}`,
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
          label: '.\n.\n.',
          group: index.toString(),
          font: {
            vadjust: -2.57,
          },
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
   * adds given layer to visualized layers at insertionIndex
   * updates layers of parent via updateFunc callback
   * @param layer to be inserted
   **/
  function addLayer(layer) {
    if (insertionIndex !== undefined) {
      const newLayers = [
        ...visualizedLayers.slice(0, insertionIndex),
        layer,
        ...visualizedLayers.slice(insertionIndex, visualizedLayers.length),
      ]
      setVisualizedLayers([...newLayers])
      newLayers.shift()
      updateFunc('layers', newLayers)
    }
  }

  function configureLayer(units, activation) {
    const layer = new Layer('Dense', units, activation)
    addLayer(layer)
    setOpen(false)
  }

  function cancelConfig() {
    setOpen(false)
  }

  return (
    <div style={{ height: '100%' }}>
      <div id="network" style={{ height: '100%' }}></div>
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
    </div>
  )
}

MLPModelVisual.propTypes = {
  modelLayers: PropTypes.array,
  defaultActivation: PropTypes.string,
  updateFunc: PropTypes.func,
}
