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

  get name() {
    return this.name
  }

  set name(value) {
    this.name = value
  }

  get baseModel() {
    return this.baseModel
  }

  set baseModel(value) {
    this.baseModel = value
  }

  get parameters() {
    return this.parameters
  }

  set parameters(value) {
    this.parameters = value
  }

  get fittings() {
    return this.fittings
  }

  set fittings(value) {
    this.fittings = value
  }
}
export default ModelConfig
