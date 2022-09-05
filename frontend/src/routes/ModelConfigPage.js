import React from 'react'
import { useLocation } from 'react-router-dom'
import MLPModelVisual from '../components/ModelConfig/MLPModelVisual'
import SchNetConfig from '../components/ModelConfig/SchNetConfig'
import MLPConfig from '../components/ModelConfig/MLPConfig'
import Grid from '@mui/material/Grid'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export default function ModelConfigPage() {
  const { state } = useLocation()
  const baseModel = state.baseModel

  const selectConfig = () => {
    switch (baseModel.type.name) {
      case 'sequential':
        return <MLPConfig model={baseModel} />
      case 'schnet':
        return <SchNetConfig model={baseModel} />
    }
  }

  return <div>{selectConfig()}</div>
}
