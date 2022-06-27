import React from 'react'
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import stringToColor from '../utils'
import Button from '@mui/material/Button'

export default function MoleculeSelection() {
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
