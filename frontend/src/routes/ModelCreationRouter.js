import React from 'react'
import { Routes, Route } from 'react-router-dom'
import BaseModelsPage from './BaseModelsPage'
import ModelConfigPage from './ModelConfigPage'
import ModelsPage from './ModelsPage'
import api from '../api'
import UserContext from '../context/UserContext'
import PropTypes from 'prop-types'

export default function ModelCreationRouter({ initSelectedIndex }) {
  const [modelList, setModelList] = React.useState([])
  const user = React.useContext(UserContext)

  React.useEffect(() => {
    refreshModels()
  }, [user])

  function refreshModels() {
    api.getModelList().then((models) => setModelList(models))
  }

  function saveModel(model) {
    // Find a duplicate
    const duplicate = modelList.find((savedModel) => {
      return model.name === savedModel.name
    })

    if (duplicate) {
      return 'duplicate'
    } else if (!model) {
      return 'error'
    } else {
      api.addModelConfig(model).then(refreshModels)
      return 0
    }
  }

  return (
    <Routes>
      <Route
        path=""
        element={
          <ModelsPage
            modelList={modelList}
            initSelectedIndex={initSelectedIndex}
          />
        }
      />
      <Route path="base-models" element={<BaseModelsPage />} />
      <Route
        path="model-config"
        element={<ModelConfigPage addFunc={saveModel} />}
      />
    </Routes>
  )
}

ModelCreationRouter.propTypes = {
  initSelectedIndex: PropTypes.number,
}
