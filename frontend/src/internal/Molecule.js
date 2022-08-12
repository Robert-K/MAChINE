class Molecule {
  constructor(name, smiles, cml, analyses) {
    // Molecule name
    this.name = name
    // Molecule smiles code, string, unique
    this.smiles = smiles
    // Molecule CML code, string, unique
    this.cml = cml
    // Array of molecule analyses (see MoleculeAnalysis.js)
    this.analyses = []
    if (analyses !== undefined) {
      this.analyses = analyses
    }
  }

  // Gets the first analysis with a matching name
  getAnalysis(modelName) {
    return this.analyses.find((analysis) => {
      return (
        analysis !== undefined &&
        Object.hasOwn(analysis, 'name') &&
        analysis.name === modelName
      )
    })
  }

  // Adds an analysis to the end of the analyses array
  addAnalysis(analysis) {
    this.analyses.push(analysis)
  }
}
export default Molecule
