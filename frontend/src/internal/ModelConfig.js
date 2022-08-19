import Fitting from './Fitting'

class ModelConfig {
  /**
   * A Model Configuration consists of
   * @param id , string
   * @param name of configuration given by user, is a string
   * @param baseModelId , string
   * @param parameters dictonary of customized model parameters
   * @param fittings array of fittings for models based on this config
   */
  constructor(id, name, baseModelId, parameters, fittings) {
    this.id = id
    this.name = name
    this.baseModel = baseModelId
    this.parameters = parameters
    this.fittings = Array.isArray(fittings) ? fittings : []
  }

  /**
   * adds a new fitting based on this model configuration
   * generates fitting id using number of present fittings
   * @param datasetID string identifying the used dataset
   * @param epochs integer
   * @param batchSize integer
   * @param accuracy float between 0 and 100
   */
  addFitting(datasetID, epochs, batchSize, accuracy) {
    this.fittings.push(
      new Fitting(
        `${this.name}${
          !Array.isArray(this.fittings) || !this.fittings.length
            ? 0
            : this.fittings[this.fittings.length - 1].id + 1
        }`,
        this.id,
        this.name,
        datasetID,
        epochs,
        batchSize,
        accuracy
      )
    )
    // TODO: initiate creation of backend equivalent
  }
}
export default ModelConfig
