import React from 'react'
import BestModels from '../components/Scoreboards/BestModels'
import BestMolecules from '../components/Scoreboards/BestMolecules'

// TODO: widen tables. Why is 100% width only half?
export default function scoreboards() {
  return (
    <div align="center">
      <BestModels />
      <BestMolecules />
    </div>
  )
}
