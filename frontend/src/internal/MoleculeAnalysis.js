class MoleculeAnalysis {
  constructor(modelName, fittingID, results) {
    // Name of model that did the analysis
    this.modelName = modelName
    // FittingID of fitting that actually did the analysis
    this.fittingID = fittingID
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
