import React from 'react'
import { Box, useTheme } from '@mui/material'

export default function SchNetVisual() {
  const theme = useTheme()
  return (
    <Box position="relative" sx={{ height: '100%' }}>
      <Box
        sx={{
          width: 1,
          height: 1,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundImage: `url("/models/schnet.png")`,
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
  )
}
