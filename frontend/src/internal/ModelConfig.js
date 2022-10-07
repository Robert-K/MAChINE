class ModelConfig {
  /**
   * A Model Configuration consists of
   * @param id , string
   * @param name of configuration given by user, is a string
   * @param baseModelID , string
   * @param parameters dictionary of customized model parameters
   * @param fittings array of fittings for models based on this config
   */
  constructor(id, name, baseModelID, baseModelName, parameters, fittings) {
    this.id = id
    this.name = name
    this.baseModelID = baseModelID
    this.baseModelName = baseModelName
    this.parameters = parameters
    this.fittings = Array.isArray(fittings) ? fittings : []
  }
}
export default ModelConfig
