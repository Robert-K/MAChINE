import Fitting from './Fitting'
import ReactDOM from 'react'

class ModelConfig {
  #name
  #baseModel
  #parameters
  #fittings

  constructor(name, baseModel, parameters) {
    // Model name
    // Identifier of base model
    // Object with config parameters. Unknown structure
    // Array of fittings
    this.fittings = []
    this.name = name
    this.baseModel = baseModel
    this.parameters = parameters
  }

  addFitting(dataset, epochs, accuracy) {
    const fittingProps = {
      model: this,
      dataset,
      epochs,
      accuracy,
    }
    this.fittings.push(ReactDOM.createElement(Fitting, fittingProps, null))
  }
}
export default ModelConfig
