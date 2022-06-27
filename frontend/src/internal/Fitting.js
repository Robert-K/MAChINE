class Fitting {
  constructor(name, datasetID, epochs, accuracy) {
    // Name of fitting
    this.name = name
    // Dataset identifier
    this.datasetID = datasetID
    // Amount of epochs model was trained for
    this.epochs = epochs
    // Accuracy of fitting
    this.accuracy = accuracy
  }
}
export default Fitting
