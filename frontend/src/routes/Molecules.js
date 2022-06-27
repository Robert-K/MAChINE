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

export default function Molecules() {
  return (
    <Box sx={{ m: 5 }}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          {moleculeSelection()}
        </Grid>
        <Grid item md={9}>
          {moleculeView()}
        </Grid>
      </Grid>
    </Box>
  )
}

function moleculeSelection() {
  const [selectedIndex, setSelectedIndex] = React.useState(1)

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
  }

  function stringToColor(string) {
    let hash = 0
    let i

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }

    return color
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

function moleculeView() {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{ background: 'black', width: '100%', height: '600px', mb: 5 }}
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
