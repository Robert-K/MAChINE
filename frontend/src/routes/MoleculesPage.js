import React from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
} from '@mui/material'
import SelectionList from '../components/shared/SelectionList'
import { useNavigate } from 'react-router-dom'
import { Kekule } from 'kekule'
import UserContext from '../UserContext'
import api from '../api'
import SaveIcon from '@mui/icons-material/Save'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PropTypes from 'prop-types'
import MoleculeEditor from '../components/molecules/MoleculeEditor'
import MoleculeRenderer from '../components/molecules/MoleculeRenderer'

const gridHeight = '85vh'
export default function MoleculesPage() {
  const [molecules, setMolecules] = React.useState([])
  const [selectedMolecule, setSelectedMolecule] = React.useState(null)

  const user = React.useContext(UserContext)

  React.useEffect(() => {
    refreshMolecules()
  }, [user])

  function refreshMolecules() {
    api.getMoleculeList().then((moleculeList) => {
      setMolecules(moleculeList)
      console.log(moleculeList)
    })
  }

  function onMoleculeSelect(index) {
    setSelectedMolecule(
      molecules[index] !== undefined ? molecules[index] : null
    )
  }

  return (
    <Box sx={{ m: 2 }}>
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
        <Grid item md={9} key="molecule-view">
          <MoleculeView
            selectedMolecule={selectedMolecule}
            update={() => {
              refreshMolecules()
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
// TODO: Disallow deselection in SelectionList
// TODO: Check for duplicate molecule names, molecule smiles... and don't allow save if duplicate
function MoleculeView({ selectedMolecule, update }) {
  const [editorHeight, editorWidth] = ['70vh', '100%']

  const [moleculeDoc, setMoleculeDoc] = React.useState(null)
  const [molName, setMolName] = React.useState('')
  const [show3D, setShow3D] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const document = new Kekule.ChemDocument()
    if (selectedMolecule && selectedMolecule.cml) {
      document.appendChild(
        Kekule.IO.loadFormatData(selectedMolecule.cml, 'cml')
      )
    }
    setMoleculeDoc(document)
  }, [selectedMolecule])

  return (
    <Card sx={{ maxHeight: gridHeight, height: gridHeight }}>
      <CardContent>
        {show3D === true ? (
          <MoleculeRenderer
            moleculeDoc={moleculeDoc}
            width={editorWidth}
            height={editorHeight}
          />
        ) : (
          <MoleculeEditor
            moleculeDoc={moleculeDoc}
            width={editorWidth}
            height={editorHeight}
          />
        )}
      </CardContent>
      <CardActions>
        <Box component="form" onSubmit={saveMol}>
          <TextField
            label="Molecule Name"
            variant="standard"
            onChange={(e) => setMolName(e.target.value)}
            inputProps={{ maxLength: 42 }}
          />
          <Button
            size="large"
            variant="outlined"
            type="submit"
            sx={{ mr: 'auto', ml: 1 }}
            endIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Button
          variant="contained"
          onClick={() => setShow3D(!show3D)}
          endIcon={<VisibilityIcon />}
        >{`Switch to ${show3D ? '2D-Editor' : '3D-Viewer'}`}</Button>
        <Box sx={{ flexGrow: 1 }}></Box>
        <Button
          size="large"
          variant="outlined"
          onClick={() =>
            navigate('/trained-models', {
              state: { selectedSmiles: selectedMolecule.smiles },
            })
          }
          disabled={!selectedMolecule}
        >
          {/* TODO: Rework disabled when MoleculeEditor is done */}
          Analyze {selectedMolecule ? selectedMolecule.name : ''}
        </Button>
      </CardActions>
    </Card>
  )

  function saveMol(event) {
    event.preventDefault()
    const molecule = moleculeDoc.getChildAt(0)
    api
      .addMolecule(
        Kekule.IO.saveFormatData(molecule, 'smi'),
        Kekule.IO.saveFormatData(molecule, 'cml'),
        molName
      )
      .then(update)
  }
}

MoleculeView.propTypes = {
  selectedMolecule: PropTypes.object,
  update: PropTypes.func,
}
