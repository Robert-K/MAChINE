import React from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Snackbar,
  Alert,
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
  const [errorMessage, setErrorMessage] = React.useState('')
  const [showSnackBar, setShowSnackBar] = React.useState(false)

  const user = React.useContext(UserContext)

  React.useEffect(() => {
    refreshMolecules()
  }, [user])

  function refreshMolecules() {
    api.getMoleculeList().then((moleculeList) => setMolecules(moleculeList))
  }

  function onMoleculeSelect(index) {
    setSelectedMolecule(
      molecules[index] !== undefined ? molecules[index] : null
    )
  }

  function showSnackError(message) {
    setShowSnackBar(true)
    setErrorMessage(message)
  }

  function saveMolecule(molName, smiles, cml) {
    // Find a duplicate
    const duplicate = molecules.find((mol) => {
      return mol.smiles === smiles || mol.cml === cml || mol.name === molName
    })

    if (duplicate) {
      showSnackError(`Molecule already saved as "${duplicate.name}"`)
    } else if (!molName || !smiles || !cml) {
      showSnackError(`Can't save molecule.`)
    } else {
      api.addMolecule(smiles, cml, molName).then(refreshMolecules)
    }
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
            addFunc={() => onMoleculeSelect(-1)}
            updateFunc={(index) => onMoleculeSelect(index)}
            height={gridHeight}
          ></SelectionList>
        </Grid>
        <Grid item md={9} key="molecule-view">
          <MoleculeView
            selectedMolecule={selectedMolecule}
            onSave={saveMolecule}
          />
        </Grid>
      </Grid>
      <Snackbar
        open={showSnackBar}
        onClose={() => setShowSnackBar(false)}
        key="error-snack"
      >
        <Alert
          onClose={() => setShowSnackBar(false)}
          severity="warning"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

function MoleculeView({ selectedMolecule, onSave }) {
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
    <Card sx={{ maxHeight: gridHeight, height: gridHeight, overflow: 'auto' }}>
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
        <Box
          component="form"
          onSubmit={saveMol}
          sx={{ display: 'inherit', ml: 4 }}
        >
          <TextField
            label="Molecule Name"
            variant="standard"
            onChange={(e) => setMolName(e.target.value)}
            inputProps={{ maxLength: 21 }}
          />
          <Button
            size="large"
            variant="outlined"
            type="submit"
            endIcon={<SaveIcon />}
            disabled={!molName}
            sx={{ ml: 1 }}
          >
            Save
          </Button>
        </Box>
        <Button
          size="large"
          variant="contained"
          onClick={() => setShow3D(!show3D)}
          endIcon={<VisibilityIcon />}
          sx={{ ml: 12 }}
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
          Analyze {selectedMolecule ? selectedMolecule.name : ''}
        </Button>
      </CardActions>
    </Card>
  )

  function saveMol(event) {
    event.preventDefault()
    try {
      const molecule = moleculeDoc.getChildAt(0)
      const smiles = Kekule.IO.saveFormatData(molecule, 'smi')
      const cml = Kekule.IO.saveFormatData(molecule, 'cml')
      onSave(molName, smiles, cml)
    } catch (e) {
      onSave('', '', '')
    }
  }
}

MoleculeView.propTypes = {
  selectedMolecule: PropTypes.object,
  onSave: PropTypes.func,
}
