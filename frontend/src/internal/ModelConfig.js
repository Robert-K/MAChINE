class ModelConfig {
  constructor(name, baseID, parameters, fittings) {
    // Model name
    this.name = name
    // Identifier of Base model
    this.baseID = baseID
    // Object with config parameters. Unknown structure
    this.parameters = parameters
    // Array of Fittings
    this.fittings = fittings
  }
}
export default ModelConfig
