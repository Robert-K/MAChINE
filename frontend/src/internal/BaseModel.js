class BaseModel {
  constructor(name, id, type, taskType, compatibleDatasets) {
    // String, name for base model
    this.name = name
    // Identifier for base model
    this.id = id
    // ModelType, describes the base model's type as well as the type's
    // associated image.
    this.type = type
    // String, describes base model task type, ex; "regression", "classifier"
    this.taskType = taskType
    // Array of Dataset Identifiers
    this.compatibleDatasets = compatibleDatasets
  }
}
export default BaseModel
