class BaseModel {
  constructor(name, id, type, taskType, parameters) {
    // String, name for base model
    this.name = name
    // Identifier for base model
    this.id = id
    // ModelType, describes the base model's type as well as the type's associated image.
    this.type = type
    // String, describes base model task type, ex; "regression", "classification"
    this.taskType = taskType
    // js object containing type-specific additional model parameters
    this.parameters = parameters
  }
}
export default BaseModel
