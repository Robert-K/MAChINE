import React from 'react'
import { useLocation } from 'react-router-dom'
import SchNetConfig from '../components/models/modelConfig/SchNetConfig'
import MLPConfig from '../components/models/modelConfig/MLPConfig'

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
