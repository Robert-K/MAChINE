import React from 'react'
import BestModels from '../components/Scoreboards/BestModels'
import BestMolecules from '../components/Scoreboards/BestMolecules'

// TODO: align column widths
export default function scoreboards() {
  return (
    <div>
      <BestModels />
      <BestMolecules />
    </div>
  )
}
