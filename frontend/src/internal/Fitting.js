class Fitting {
  constructor(name, datasetID, epochs, accuracy) {
    // Name of Fitting
    this.name = name
    // Dataset Identifier
    this.datasetID = datasetID
    // Amount of Epochs Model was trained for
    this.epochs = epochs
    // Accuracy of fitting
    this.accuracy = accuracy
  }
}
export default Fitting
