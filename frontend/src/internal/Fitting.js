class Fitting {
  /**
   * A Fitting models a training result and consists of
   * @param id {string} in format of: '{model}{integer}'
   * @param modelID {string} of used ModelConfig, string
   * @param modelName {string} of used ModelConfig, string
   * @param datasetID {string} of used dataset, string
   * @param datasetName {string} Name of used dataset
   * @param labels {array} the labels this fitting was trained with
   * @param epochs {number} how many epochs the fitting was trained for
   * @param batchSize {number} size of data batches between each weight update
   * @param accuracy {number} accuracy of the fitting
   */
  constructor(
    id,
    modelID,
    modelName,
    datasetID,
    datasetName,
    labels,
    epochs,
    batchSize,
    accuracy
  ) {
    this.id = id
    this.modelID = modelID
    this.modelName = modelName
    this.datasetID = datasetID
    this.datasetName = datasetName
    this.labels = labels
    this.epochs = epochs
    this.batchSize = batchSize
    this.accuracy = accuracy
  }
}
export default Fitting
