import React from 'react'
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  useTheme,
} from '@mui/material'
import SelectionList from '../components/shared/SelectionList'
import { useNavigate } from 'react-router-dom'
import { Kekule } from 'kekule'
import UserContext from '../context/UserContext'
import api from '../api'
import SaveIcon from '@mui/icons-material/Save'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PropTypes from 'prop-types'
import MoleculeEditor from '../components/molecules/MoleculeEditor'
import MoleculeRenderer from '../components/molecules/MoleculeRenderer'
import Molecule from '../internal/Molecule'
import SnackBarAlert from '../components/misc/SnackBarAlert'
import HelpPopper from '../components/shared/HelpPopper'
import HelpContext from '../context/HelpContext'

const gridHeight = '85vh'
export default function MoleculesPage() {
  const [molecules, setMolecules] = React.useState([])
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [selectedMolecule, setSelectedMolecule] = React.useState(null)
  const [snackMessage, setSnackMessage] = React.useState('')
  const [showSnackBar, setShowSnackBar] = React.useState(false)
  const [snackSeverity, setSnackSeverity] = React.useState('warning')
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null)
  const [helpPopperContent, setHelpPopperContent] = React.useState('')
  const user = React.useContext(UserContext)
  const help = React.useContext(HelpContext)

  const handleHelpPopperOpen = (event, content) => {
    if (help.helpMode) {
      setHelpAnchorEl(event.currentTarget)
      setHelpPopperContent(content)
    }
  }

  const handleHelpPopperClose = () => {
    setHelpAnchorEl(null)
  }

  const helpOpen = Boolean(helpAnchorEl)

  React.useEffect(() => {
    refreshMolecules()
  }, [user])

  function refreshMolecules(addedMol) {
    api.getMoleculeList().then((moleculeList) => {
      setMolecules(moleculeList)
      if (addedMol) {
        setSelectedMolecule(addedMol)
        setSelectedIndex(moleculeList.length - 1)
      }
    })
  }

  function onMoleculeSelect(index) {
    const molecule = molecules[index]
    if (molecule !== undefined) {
      const copy = new Molecule(
        molecule.name,
        molecule.smiles,
        molecule.cml,
        molecule.analyses
      )
      setSelectedMolecule(copy)
    } else {
      setSelectedMolecule(new Molecule(null, null, null, null))
    }
  }

  function showSnackMessage(message, severity) {
    setShowSnackBar(true)
    setSnackMessage(message)
    setSnackSeverity(severity)
  }

  function saveMolecule(molName, smiles, cml) {
    // Find a duplicate
    const duplicate = molecules.find((mol) => {
      return mol.smiles === smiles || mol.cml === cml || mol.name === molName
    })

    if (duplicate) {
      showSnackMessage(
        `Molecule already saved as "${duplicate.name}"`,
        'warning'
      )
    } else if (!molName || !smiles || !cml) {
      showSnackMessage(`Can't save molecule.`, 'error')
    } else {
      api
        .addMolecule(smiles, cml, molName)
        .then(() => {
          refreshMolecules(new Molecule(molName, smiles, cml))
        })
        .catch(() =>
          showSnackMessage(
            `Can't save invalid Molecule. Check for Errors in the Editor`,
            'error'
          )
        )
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
        <Grid
          item
          md={3}
          onMouseOver={(e) => {
            handleHelpPopperOpen(
              e,
              'This shows all molecules you have created so far. Click on the i-Icon to see more information about a molecule.'
            )
          }}
          onMouseLeave={handleHelpPopperClose}
        >
          <SelectionList
            elements={molecules}
            elementType="molecule"
            usePopper={true}
            addFunc={() => onMoleculeSelect(-1)}
            updateFunc={(index) => onMoleculeSelect(index)}
            height={gridHeight}
            forcedSelectedIndex={selectedIndex}
            pageName={'molecules'}
          ></SelectionList>
        </Grid>
        <Grid
          item
          md={9}
          key="molecule-view"
          className="molecule-view"
          onMouseOver={(e) => {
            handleHelpPopperOpen(
              e,
              "This is your molecule sandbox! Let your creativity flow and create the molecule of your dreams.\nClick on the line-icon on the left to create new bonds, on the C-icon to change an atom, or on the eraser-icon to delete things.\nWhen you're happy with your molecule, give it a name and save it!\nSaved molecules can be analyzed by the models you have trained with a click on the button 'Analyze' in the bottom right corner."
            )
          }}
          onMouseLeave={handleHelpPopperClose}
        >
          <MoleculeView
            className="molecule-view"
            selectedMolecule={selectedMolecule}
            onSave={saveMolecule}
          />
        </Grid>
        <HelpPopper
          id="helpPopper"
          helpPopperContent={helpPopperContent}
          open={helpOpen}
          anchorEl={helpAnchorEl}
          onClose={handleHelpPopperClose}
        />
      </Grid>
      <SnackBarAlert
        message={snackMessage}
        onClose={() => setShowSnackBar(false)}
        open={showSnackBar}
        severity={snackSeverity}
      />
    </Box>
  )
}

function MoleculeView({ selectedMolecule, onSave }) {
  const [editorHeight, editorWidth] = ['70vh', '100%']

  const [moleculeDoc, setMoleculeDoc] = React.useState(null)
  const [molName, setMolName] = React.useState('')
  const [show3D, setShow3D] = React.useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

  React.useEffect(() => {
    const chemDocument = new Kekule.ChemDocument()
    if (selectedMolecule && selectedMolecule.cml) {
      chemDocument.appendChild(
        Kekule.IO.loadFormatData(selectedMolecule.cml, 'cml')
      )
    }
    setMoleculeDoc(chemDocument)
  }, [selectedMolecule])

  return (
    <Card sx={{ maxHeight: gridHeight, height: gridHeight, overflow: 'auto' }}>
      <CardContent>
        <Box
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {show3D === true ? (
            <MoleculeRenderer
              moleculeDoc={moleculeDoc}
              width={editorWidth}
              height={editorHeight}
            />
          ) : (
            <Box
              sx={{
                filter: theme.darkMode ? 'invert(.86)' : false,
              }}
            >
              <MoleculeEditor
                moleculeDoc={moleculeDoc}
                width={editorWidth}
                height={editorHeight}
              />
            </Box>
          )}
        </Box>
        <Backdrop
          sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={selectedMolecule === null}
        >
          Select a molecule or add one on the left to view & edit it here .
        </Backdrop>
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
          className="analyze-button"
          onClick={() =>
            navigate('/trained-models', {
              state: { selectedSmiles: selectedMolecule.smiles },
            })
          }
          disabled={!(selectedMolecule && selectedMolecule.smiles)}
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
