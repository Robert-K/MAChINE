/**
 * A model type contains the description of a base model's type as well as a fitting image.
 */

class ModelType {
  constructor(name, image) {
    // String, describes base model type, ex: "Variational Outlier Encoder"
    this.name = name
    // Image, the base model's associated image
    this.image = image
  }
}
