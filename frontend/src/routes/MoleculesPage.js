import React from 'react'
import { Card, CardContent, Grid, Box, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import SelectionList from '../components/SelectionList'
import { Link } from 'react-router-dom'
import { Jsme } from 'jsme-react'
import UserContext from '../UserContext'
import api from '../api'
import Molecule from '../internal/Molecule'

export default function MoleculesPage() {
  const [molecules, setMolecules] = React.useState([])
  const user = React.useContext(UserContext)

  React.useEffect(() => {
    api.getMoleculeList(user.userID).then((moleculeList) => {
      setMolecules(moleculeList)
      console.log(moleculeList)
    })
  }, [user])

  // TODO
  let selectedMolecule = new Molecule('', '', '')

  let showEditor = true

  function onMoleculeSelect(molecule, index) {
    selectedMolecule = molecules[index]
    showEditor = true
    console.log(selectedMolecule)
    forceUpdate()
  }

  function useForceUpdate() {
    const [, setValue] = React.useState(0) // integer state
    return () => setValue((value) => value + 1) // update state to force render
    // An function that increment 👆🏻 the previous state like here
    // is better than directly setting `value + 1`
  }

  const forceUpdate = useForceUpdate()

  // eslint-disable-next-line no-unused-vars
  return (
    <Box sx={{ m: 5 }}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          {
            <SelectionList
              elements={molecules}
              /* Todo enter the userID above */
              elementType="molecule"
              usePopper={true}
              addFunc={() =>
                console.log('Implement add molecule in molecules page')
              }
              updateFunc={(index) => onMoleculeSelect(index)}
            ></SelectionList>
          }
        </Grid>
        <Grid item md={9} key={selectedMolecule.smiles}>
          {MoleculeView(selectedMolecule.smiles, showEditor)}
        </Grid>
      </Grid>
    </Box>
  )
}

function MoleculeEditor(show, smiles, onChange) {
  console.log(show, 'ayyyy')
  if (!show)
    return (
      <div style={{ width: '100%', height: '600px', background: 'red' }}></div>
    )
  return (
    <Jsme
      height="600px"
      width="100%"
      smiles={smiles}
      onChange={() => onChange}
      src="JSME_2022-02-26/jsme/jsme.nocache.js" // Oh god why
    />
  )
}

function MoleculeView(smiles, showEditor) {
  function logSmiles(smiles) {
    console.log(smiles)
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2 }} key={'jsme' + smiles}>
          {MoleculeEditor(showEditor, smiles, logSmiles)}
        </Box>
        <Grid container spacing={2}>
          <Grid item>
            <TextField label="Name"></TextField>
          </Grid>
          <Grid item style={{ flex: 1 }}>
            <Button size="large" variant="outlined" sx={{ minHeight: 55 }}>
              Save
            </Button>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to="/trained-models"
              size="large"
              variant="outlined"
              sx={{ minHeight: 55 }}
            >
              Analyze!
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
