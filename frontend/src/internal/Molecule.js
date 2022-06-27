class Molecule {
  constructor(name, smiles, analyses) {
    this.name = name
    this.smiles = smiles
    this.analyses = []
    if (analyses !== undefined) {
      this.analyses = analyses
    }
  }

  getAnalysis(modelName) {
    return this.analyses.find((analysis) => {
      return (
        analysis !== undefined &&
        Object.hasOwn(analysis, 'name') &&
        analysis.name === modelName
      )
    })
  }

  addAnalysis(analysis) {
    this.analyses.push(analysis)
  }
}
export default Molecule
