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
import Button from '@mui/material/Button'
import PropTypes from 'prop-types'
import stringToColor from '../../utils'
import DetailsPopper from './DetailsPopper'
import MoleculeInfo from '../molecules/MoleculeInfo'
import AddIcon from '@mui/icons-material/Add'

/**
 * List of given elements with corresponding avatars and description text
 * @param updateFunc state function used to inform parent components of current selection
 * @param elements array of elements to be displayed
 * @param elementType string describing element type
 * @param usePopper boolean whether a descriptive popper should appear
 * @param addFunc function to be called when using add button
 * @returns {JSX.Element}
 */
export default function SelectionList({
  updateFunc,
  elements,
  elementType,
  usePopper,
  addFunc,
  height,
}) {
  const [selectedIndex, setSelectedIndex] = React.useState('none')
  const [open, setOpen] = React.useState(false)
  const [waited, setWaited] = React.useState(false)
  const [content, setContent] = React.useState(<h1>Placeholder</h1>)
  const [anchor, setAnchor] = React.useState(null)

  /**
   * popper configuration
   * @param target selected target field
   * @param content data to be displayed
   * @param show boolean whether data should be displayed
   */
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

  /**
   * click handler for list items
   * updates parent component's state if necessary
   * @param event
   * @param element
   * @param index of clicked item
   */
  const handleListItemClick = (event, element, index) => {
    setSelectedIndex(index)
    if (updateFunc !== undefined) updateFunc(element, index)
    if (usePopper) handlePopper(null, <div />, false)
  }

  return (
    <Card
      sx={{
        height,
        maxHeight: height,
      }}
    >
      <CardContent
        sx={{ flexDirection: 'column', height: '100%', display: 'flex' }}
      >
        <CardActions>
          <Button onClick={() => addFunc()}>
            <AddIcon sx={{ mr: 1 }} /> Add a {elementType}
          </Button>
        </CardActions>
        <List sx={{ flexGrow: 1, overflow: 'scroll' }}>
          {elements.map((element, index) => (
            <ListItemButton
              key={element.name}
              onDoubleClick={(event) =>
                handleListItemClick(event, element, index)
              }
              onClick={(event) => {
                if (usePopper) {
                  handlePopper(
                    event.currentTarget,
                    <MoleculeInfo molecule={element}></MoleculeInfo>,
                    event.currentTarget !== anchor || !open
                  )
                } else handleListItemClick(event, element, index)
              }}
              selected={selectedIndex === element.name}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{ bgcolor: stringToColor(`${element.name} peter`) }}
                >
                  <p>{element.name}</p>
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={element.name} />
            </ListItemButton>
          ))}
        </List>
        <DetailsPopper
          anchor={anchor}
          open={open}
          content={content}
          animate={waited}
          popperWidth={300}
        />
      </CardContent>
    </Card>
  )
}

SelectionList.propTypes = {
  elements: PropTypes.array.isRequired,
  usePopper: PropTypes.bool.isRequired,
  elementType: PropTypes.string.isRequired,
  updateFunc: PropTypes.func,
  addFunc: PropTypes.func.isRequired,
  height: PropTypes.any,
}

SelectionList.defaultProps = {
  height: '7vh',
}
