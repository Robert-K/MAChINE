import Fitting from './Fitting'

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
    this.fittings.push(new Fitting(this, dataset, epochs, accuracy))
  }
}
export default ModelConfig
