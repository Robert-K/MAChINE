import React from 'react'
import { Card, CardContent, Grid, Box, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import Molecule from '../internal/Molecule'
import MoleculeAnalysis from '../internal/MoleculeAnalysis'
import SelectionList from '../components/SelectionList'
import { Link } from 'react-router-dom'

export default function MoleculesPage() {
  const testMolecules = [
    new Molecule('aa', 'aa', [
      new MoleculeAnalysis('aa', 1, { toxicity: 5000 }),
      new MoleculeAnalysis('gg', 0, { power_level: 500, noble_gas: false }),
    ]),
    new Molecule('aaa', 'aawfa', [
      new MoleculeAnalysis('aa', 1, { toxicity: 500 }),
      new MoleculeAnalysis('gg', 0, { power_level: 500, noble_gas: false }),
    ]),
    new Molecule('aaaa', 'afawfa', [
      new MoleculeAnalysis('aa', 1, { toxicity: 11616 }),
      new MoleculeAnalysis('gg', 0, { power_level: 4, noble_gas: true }),
    ]),
    new Molecule('aaaaaa', 'aawfawfawfa', [
      new MoleculeAnalysis('aa', 0, { toxicity: 124 }),
      new MoleculeAnalysis('gg', 6, {
        power_level: 1,
        noble_gas: false,
      }),
      new MoleculeAnalysis('tt', 3, {
        test: 1,
        other_test: 12512512,
        other_other_test: `yes but maybe not it's quite weird tbh`,
        smells_good: false,
        light: 'no',
      }),
    ]),
    new Molecule('gg', 'gg', [
      new MoleculeAnalysis('gg', 5, { power_level: 9001 }),
    ]),
  ]
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
            ></SelectionList>
          }
        </Grid>
        <Grid item md={9}>
          {MoleculeView()}
        </Grid>
      </Grid>
    </Box>
  )
}

function MoleculeView() {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{ background: 'black', width: '100%', height: '600px', mb: 2 }}
        ></Box>
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
