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
    this._fittings = []
    this._name = name
    this._baseModel = baseModel
    this._parameters = parameters
  }

  addFitting(dataset, epochs, accuracy) {
    this._fittings.push(new Fitting(this, dataset, epochs, accuracy))
  }

  get name() {
    return this._name
  }

  set name(value) {
    this._name = value
  }

  get baseModel() {
    return this._baseModel
  }

  set baseModel(value) {
    this._baseModel = value
  }

  get parameters() {
    return this._parameters
  }

  set parameters(value) {
    this._parameters = value
  }

  get fittings() {
    return this._fittings
  }

  set fittings(value) {
    this._fittings = value
  }
}
export default ModelConfig
