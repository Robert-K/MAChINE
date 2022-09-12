import React from 'react'
import { Card } from '@mui/material'
import Image from 'mui-image'

export default function SchNetVisual() {
  return (
    <Card sx={{ height: '85vh', m: 2 }}>
      <Image src="graph.png" alt="Image of graph"></Image>
    </Card>
  )
}
