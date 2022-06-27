class MoleculeAnalysis {
  constructor(modelName, results) {
    // Name of model that did the analysis
    this.modelName = modelName
    /* Results object, consists of key: value pairs
     * Example:
     * {
     *  power_level: 9001,
     *  noble_gas: false,
     *  light: 'no',
     * }
     */
    this.results = results
  }
}
export default MoleculeAnalysis
