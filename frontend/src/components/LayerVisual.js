import { Box, useTheme } from '@mui/material'
import React from 'react'
import Graph from 'vis-react'

export default function LayerVisual(layer) {
  const theme = useTheme()

  const graph = {
    nodes: [
      { id: '1', label: 'node 1' },
      { id: '2', label: 'node 2' },
      { id: '3', label: 'node 3' },
      { id: '4', label: 'node 4' },
    ],

    edges: [
      { from: 1, to: 2 },
      { from: 3, to: 2 },
      { from: 4, to: 2 },
      { from: 3, to: 1 },
    ],
  }

  return (
    <Box
      sx={{
        border: '1px',
        borderColor: theme.palette.primary.main,
        width: '100%',
        height: '80vh',
      }}
    >
      <Graph graph={graph} options={options}></Graph>
    </Box>
  )
}
