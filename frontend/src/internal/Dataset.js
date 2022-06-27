class Dataset {
  constructor(name, datasetID, size, labelDescriptors) {
    // Name of dataset
    this.name = name
    // Identifier of dataset
    this.datasetID = datasetID
    // Amount of entries in dataset
    this.size = size
    /* Array of strings corresponding to semantic value of label data
        Classification: Array with >= 2 elements
        Regression: Single element array
     */
    this.labelDescriptors = labelDescriptors
  }
}
export default Dataset
