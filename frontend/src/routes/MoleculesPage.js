import React from 'react'
import { Card, CardContent, Grid, Box, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Molecule from '../internal/Molecule'
import MoleculeAnalysis from '../internal/MoleculeAnalysis'
import SelectionList from '../components/SelectionList'
import { Link } from 'react-router-dom'
import { Jsme } from 'jsme-react'

export default function MoleculesPage() {
  const testMolecules = [
    new Molecule('molecule_1', 'CC(CC1=CC=CC=C1)NC', [
      new MoleculeAnalysis('my favourite model', 1, { toxicity: 5000 }),
      new MoleculeAnalysis('second_model', 0, {
        power_level: 500,
        noble_gas: false,
      }),
    ]),
    new Molecule('molecule_2', 'CCC', [
      new MoleculeAnalysis('my favourite model', 1, { toxicity: 500 }),
      new MoleculeAnalysis('second_model', 0, {
        power_level: 500,
        noble_gas: false,
      }),
    ]),
    new Molecule('molecule_3', 'CNC', [
      new MoleculeAnalysis('my favourite model', 1, { toxicity: 11616 }),
      new MoleculeAnalysis('second_model', 0, {
        power_level: 4,
        noble_gas: true,
      }),
    ]),
    new Molecule('molecule_4', 'C1=CC=CN', [
      new MoleculeAnalysis('my favourite model', 0, { toxicity: 124 }),
      new MoleculeAnalysis('second_model', 6, {
        power_level: 1,
        noble_gas: false,
      }),
      new MoleculeAnalysis('third_model', 3, {
        test: 1,
        other_test: 12512512,
        other_other_test: `yes but maybe not it's quite weird tbh`,
        smells_good: false,
        light: 'no',
      }),
    ]),
    new Molecule('Hydrogen-chloride', 'CCCCCCCC', [
      new MoleculeAnalysis('second_model', 5, { power_level: 9001 }),
    ]),
  ]

  let selectedMolecule = testMolecules[0]

  let showEditor = true

  function onMoleculeSelect(molecule, index) {
    selectedMolecule = molecule
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

  return (
    <Box sx={{ m: 5 }}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          {
            <SelectionList
              elements={testMolecules}
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
