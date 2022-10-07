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
}
export default Molecule
