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
import stringToColor from '../../utils'
import Button from '@mui/material/Button'
import PropTypes from 'prop-types'
import DetailsPopper from '../shared/DetailsPopper'
import MoleculeInfo from '../molecules/MoleculeInfo'

export default function MoleculeSelection({ molecules }) {
  const [selectedIndex, setSelectedIndex] = React.useState('a')
  const [open, setOpen] = React.useState(false)
  const [waited, setWaited] = React.useState(false)
  const [content, setContent] = React.useState(<h1>Placeholder</h1>)
  const [anchor, setAnchor] = React.useState(null)

  const handlePopper = (target, content, show) => {
    setContent(content)
    setAnchor(target)
    setOpen(show)
    setWaited(false)
    if (show) {
      setTimeout(() => {
        setWaited(true)
      }, 150)
    }
  }

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
    handlePopper(null, <div />, false)
  }

  return (
    <Card>
      <CardContent>
        <List sx={{ height: '612px', maxHeight: '612px', overflow: 'auto' }}>
          {molecules.map((molecule) => (
            <ListItemButton
              key={molecule.smiles}
              onDoubleClick={(event) =>
                handleListItemClick(event, molecule.smiles)
              }
              onClick={(event) =>
                handlePopper(
                  event.currentTarget,
                  <MoleculeInfo molecule={molecule}></MoleculeInfo>,
                  event.currentTarget !== anchor || !open
                )
              }
              selected={selectedIndex === molecule.smiles}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{ bgcolor: stringToColor(`${molecule.name} peter`) }}
                >
                  <p>{molecule.name}</p>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`Hello, I am ${molecule.name}`}
                secondary={`This is a molecule, select it! ${molecule.smiles}`}
              />
            </ListItemButton>
          ))}
        </List>
        <DetailsPopper
          anchor={anchor}
          open={open}
          content={content}
          animate={waited}
          popperWidth={200}
        />
      </CardContent>
      <CardActions>
        <Button>Add a molecule</Button>
      </CardActions>
    </Card>
  )
}

MoleculeSelection.propTypes = {
  molecules: PropTypes.array.isRequired,
}
