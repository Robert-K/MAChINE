class Layer {
  constructor(type, units, activation) {
    // String of layer type
    this.type = type
    // integer number of units in layer
    this.units = units
    // optional: string of activation function used
    this.activation = activation
  }
}

export default Layer
