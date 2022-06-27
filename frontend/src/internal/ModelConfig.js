class ModelConfig {
  constructor(name, baseID, parameters, fittings) {
    // Model name
    this.name = name
    // Identifier of base model
    this.baseID = baseID
    // Object with config parameters. Unknown structure
    this.parameters = parameters
    // Array of fittings
    this.fittings = fittings
  }
}
export default ModelConfig
