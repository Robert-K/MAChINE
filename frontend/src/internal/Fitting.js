class Fitting {
  /**
   * A Fitting models a training result and consists of
   * @param id string in format of: '{model}{integer}'
   * @param modelID of used ModelConfig, string
   * @param modelName of used ModelConfig, string
   * @param datasetID of used dataset, string
   * @param labels the labels this fitting was trained with
   * @param epochs , integer
   * @param batchSize , integer
   * @param accuracy , float between 0 and 100
   */
  constructor(
    id,
    modelID,
    modelName,
    datasetID,
    labels,
    epochs,
    batchSize,
    accuracy
  ) {
    this.id = id
    this.modelID = modelID
    this.modelName = modelName
    this.datasetID = datasetID
    this.labels = labels
    this.epochs = epochs
    this.batchSize = batchSize
    this.accuracy = accuracy
  }
}
export default Fitting
