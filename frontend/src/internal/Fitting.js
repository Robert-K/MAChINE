class Fitting {
  /**
   * A Fitting models a training result and consists of
   * @param id string in format of: '{model}{integer}'
   * @param modelID of used ModelConfig, string
   * @param datasetID of used dataset, string
   * @param epochs , integer
   * @param accuracy , float between 0 and 100
   */
  constructor(id, modelID, datasetID, epochs, accuracy) {
    this.id = id
    this.modelID = modelID
    this.datasetID = datasetID
    this.epochs = epochs
    this.accuracy = accuracy
  }
}
export default Fitting
