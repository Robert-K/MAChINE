import React from 'react'
import { Box, Button, Card, CardContent, Grid, TextField } from '@mui/material'
import SelectionList from '../components/shared/SelectionList'
import { useNavigate } from 'react-router-dom'
import { Kekule } from 'kekule'
import UserContext from '../UserContext'
import api from '../api'
import Molecule from '../internal/Molecule'
import SaveIcon from '@mui/icons-material/Save'
import PropTypes from 'prop-types'
import MoleculeEditor from '../components/MoleculeEditor'
import MoleculeRenderer from '../components/MoleculeRenderer'

// TODO: Change Molecule format to support smiles & Kekule codes
// Both in backend in frontend, change API for this
// TODO: Add functionality to save button
// TODO: Properly position switch button

const gridHeight = '80vh'
export default function MoleculesPage() {
  const [molecules, setMolecules] = React.useState([])
  const [selectedMolecule, setSelectedMolecule] = React.useState(
    new Molecule('', '', '')
  )
  const user = React.useContext(UserContext)

  React.useEffect(() => {
    api.getMoleculeList().then((moleculeList) => {
      setMolecules(moleculeList)
      console.log(moleculeList)
    })
  }, [user])

  function onMoleculeSelect(index) {
    setSelectedMolecule(
      molecules[index] !== undefined
        ? molecules[index]
        : new Molecule('', '', '',[])
    )
    showEditor = true
    console.log(molecules[index])
  }

  return (
    <Box sx={{ m: 5 }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        columnSpacing={2}
      >
        <Grid item md={3}>
          <SelectionList
            elements={molecules}
            elementType="molecule"
            usePopper={true}
            addFunc={() =>
              console.log('Implement add molecule in molecules page')
            }
            updateFunc={(index) => onMoleculeSelect(index)}
            height={gridHeight}
          ></SelectionList>
        </Grid>
        <Grid item md={9} key={selectedMolecule.smiles}>
          <MoleculeView smiles={selectedMolecule.smiles} />
        </Grid>
      </Grid>
    </Box>
  )
}

// START TEST MOLECULE
// create molecule first
const mol = new Kekule.Molecule()

// add atoms to molecule
mol.appendNode(new Kekule.Atom().setSymbol('C').setCoord2D({ x: 0, y: 0.8 }))
// explicit set mass number of an atom
mol.appendNode(
  new Kekule.Atom()
    .setSymbol('C')
    .setMassNumber(13)
    .setCoord2D({ x: -0.69, y: 0.4 })
)

mol.appendNode(
  new Kekule.Atom().setSymbol('C').setCoord2D({ x: -0.69, y: -0.4 })
)
// a pseudo atom
mol.appendNode(
  new Kekule.Pseudoatom()
    .setAtomType(Kekule.PseudoatomType.ANY)
    .setCoord2D({ x: 0, y: -0.8 })
)
mol.appendNode(
  new Kekule.Atom().setSymbol('C').setCoord2D({ x: 0.69, y: -0.4 })
)
mol.appendNode(new Kekule.Atom().setSymbol('C').setCoord2D({ x: 0.69, y: 0.4 }))
// a variable atom
mol.appendNode(
  new Kekule.VariableAtom()
    .setAllowedIsotopeIds(['F', 'Cl', 'Br'])
    .setCoord2D({ x: 1.39, y: 0.8 })
)

// add bonds to molecule
//   here a shortcut method appendBond(atomIndexes, bondOrder) is used
mol.appendBond([0, 1], 1)
mol.appendBond([1, 2], 2)
mol.appendBond([2, 3], 1)
mol.appendBond([3, 4], 2)
mol.appendBond([4, 5], 1)
mol.appendBond([5, 0], 2)
mol.appendBond([5, 6], 1)

// END TEST MOLECULE

function MoleculeView(props) {
  const [molecule, setMolecule] = React.useState(mol)
  const [show3D, setShow3D] = React.useState(false)
  const [editorHeight, editorWidth] = ['600px', '800px']
  const [molname, setMolName] = React.useState('')
  const navigate = useNavigate()

  return (
    <Card sx={{ maxHeight: gridHeight, height: gridHeight }}>
      <CardContent
        sx={{ flexDirection: 'column', height: '100%', display: 'flex' }}
      >
        <Box sx={{ m: 2 }}>
          <MoleculeEditor />
        </Box>
        <Grid container spacing={2}>
          {/* Actual Editor */}
          <Grid item>
            {show3D === true ? (
              <MoleculeRenderer
                molecule={molecule}
                width={editorWidth}
                height={editorHeight}
              />
            ) : (
              <MoleculeEditor
                molecule={molecule}
                onChange={(newMolecule) => setMolecule(newMolecule)}
                width={editorWidth}
                height={editorHeight}
              />
            )}
          </Grid>
          <Grid item>
            <Button onClick={() => setShow3D(!show3D)}>{`Switch to ${
              show3D ? '2D-Editor' : '3D-Viewer'
            }`}</Button>
          </Grid>
          <Grid item>
            <TextField
              label="Molecule Name"
              onChange={(e) => setMolName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveMol()
                }
              }}
            />
          </Grid>
          <Grid item style={{ flex: 1 }}>
            <Button
              size="large"
              variant="outlined"
              sx={{ minHeight: 55 }}
              onClick={() => {
                saveMol()
              }}
              endIcon={<SaveIcon sx={{ ml: 1 }} />}
            >
              Save
            </Button>
          </Grid>
          <Grid item>
            <Button
              size="large"
              variant="outlined"
              onClick={() => navigate('/trained-models', { state: { smiles } })}
              disabled={!smiles}
              sx={{ minHeight: 55 }}
            >
              {/* TODO: Rework disabled when MoleculeEditor is done */}
              Analyze!
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

  function saveMol() {
    console.log('SAVED!')
    api
      .addMolecule(
        Kekule.IO.saveFormatData(molecule, 'smi'),
        Kekule.IO.saveFormatData(molecule, 'cml'),
        molname
      )
      .then()
  }
}

MoleculeView.propTypes = {
  smiles: PropTypes.string.isRequired,
}
