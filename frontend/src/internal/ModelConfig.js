import Fitting from './Fitting'
import ReactDOM from 'react'

class ModelConfig {
  /**
   * A Model Configuration consists of
   * @param id , string
   * @param name of configuration given by user, is a string
   * @param baseModelId , string
   * @param parameters array of customized model parameters
   * @param fittings array of fittings for models based on this config
   */
  constructor(id, name, baseModelId, parameters, fittings) {
    this.id = id
    this.name = name
    this.baseModel = baseModelId
    this.parameters = parameters
    this.fittings = fittings
  }

  /**
   * adds a new fitting based on this model configuration
   * generates fitting id using number of present fittings
   * @param datasetId string identifying the used dataset
   * @param epochs integer
   * @param accuracy float between 0 and 100
   */
  addFitting(datasetId, epochs, accuracy) {
    const fittingProps = {
      id: `${this.name}${
        !Array.isArray(this.fittings) || !this.fittings.length
          ? 0
          : this.fittings[this.fittings.length - 1].id + 1
      }`,
      model: this,
      dataset: datasetId,
      epochs,
      accuracy,
    }
    this.fittings.push(ReactDOM.createElement(Fitting, fittingProps, null))
    // TODO: initiate creation of backend equivalent
  }
}
export default ModelConfig
