import React from 'react'
import { Box, Button, Card, CardContent, Grid, TextField } from '@mui/material'
import SelectionList from '../components/shared/SelectionList'
import { useNavigate } from 'react-router-dom'
import UserContext from '../UserContext'
import api from '../api'
import Molecule from '../internal/Molecule'
import SaveIcon from '@mui/icons-material/Save'
import PropTypes from 'prop-types'
import MoleculeEditor from '../components/MoleculeEditor'

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

  let showEditor = true

  function onMoleculeSelect(index) {
    setSelectedMolecule(
      molecules[index] !== undefined
        ? molecules[index]
        : new Molecule('', '', '')
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
          <MoleculeView
            smiles={selectedMolecule.smiles}
            showEditor={showEditor}
          ></MoleculeView>
        </Grid>
      </Grid>
    </Box>
  )
}

function MoleculeView({ smiles }) {
  const navigate = useNavigate()
  function logSmiles(smiles) {
    console.log(smiles)
  }
  return (
    <Card sx={{ maxHeight: gridHeight, height: gridHeight }}>
      <CardContent
        sx={{ flexDirection: 'column', height: '100%', display: 'flex' }}
      >
        <Box sx={{ width: '600px', mb: 2 }}>
          <MoleculeEditor />
        </Box>
        <Grid container spacing={2}>
          <Grid item>
            <TextField label="Name"></TextField>
          </Grid>
          <Grid item style={{ flex: 1 }}>
            <Button
              size="large"
              variant="outlined"
              sx={{ minHeight: 55 }}
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
}

MoleculeView.propTypes = {
  smiles: PropTypes.string.isRequired,
}
