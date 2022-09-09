import React from 'react'
import { useLocation } from 'react-router-dom'
import SchNetConfig from '../components/models/modelConfig/SchNetConfig'
import MLPConfig from '../components/models/modelConfig/MLPConfig'
import PropTypes from 'prop-types'

export default function ModelConfigPage({ baseModel, addFunc }) {
  const selectConfig = () => {
    switch (baseModel.type.name) {
      case 'sequential':
        return <MLPConfig model={baseModel} addFunc={addFunc} />
      case 'schnet':
        return <SchNetConfig model={baseModel} />
    }
  }

  return <div>{selectConfig()}</div>
}

ModelConfigPage.propTypes = {
  baseModel: PropTypes.object.isRequired,
  addFunc: PropTypes.func.isRequired,
}
