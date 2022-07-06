// Model training process
class Fitting {
  constructor(name, id, datasetID, epochs, accuracy) {
    // Name of fitting
    this.name = name
    // Identifier of the fitting
    this.id = id
    // ID of the dataset the fitting was trained on
    this.datasetID = datasetID
    // Amount of epochs model was trained for
    this.epochs = epochs
    // Accuracy of fitting
    this.accuracy = accuracy
  }
}
export default Fitting
