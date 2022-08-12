class BaseModel {
  constructor(
    name,
    id,
    type,
    taskType,
    lossFunction,
    optimizer,
    layers,
    compatibleDatasets
  ) {
    // String, name for base model
    this.name = name
    // Identifier for base model
    this.id = id
    // ModelType, describes the base model's type as well as the type's
    // associated image.
    this.type = type
    // String, describes base model task type, ex; "regression", "classifier"
    this.taskType = taskType
    // String of loss function used for the model
    this.lossFunction = lossFunction
    // String of optimizer used for model
    this.optimizer = optimizer
    // array of predefined layers
    this.layers = layers
  }
}
export default BaseModel
