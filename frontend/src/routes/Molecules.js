import React from 'react'
import {
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  TextField,
} from '@mui/material'
import Button from '@mui/material/Button'
import stringToColor from '../utils'

export default function Molecules() {
  return (
    <Box sx={{ m: 5 }}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          {MoleculeSelection()}
        </Grid>
        <Grid item md={9}>
          {MoleculeView()}
        </Grid>
      </Grid>
    </Box>
  )
}

function MoleculeSelection() {
  const [selectedIndex, setSelectedIndex] = React.useState(1)

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
  }

  return (
    <Card>
      <CardContent>
        <List>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <ListItemButton
              key={index}
              onClick={(event) => handleListItemClick(event, index)}
              selected={index === selectedIndex}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: stringToColor(index + 'peter') }}>
                  <p>M{index}</p>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Hello, I am Molecule"
                secondary="This is a molecule, select it!"
              />
            </ListItemButton>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <Button>Add a molecule</Button>
      </CardActions>
    </Card>
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
            <Button size="large" variant="outlined" sx={{ minHeight: 55 }}>
              Analyze!
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
