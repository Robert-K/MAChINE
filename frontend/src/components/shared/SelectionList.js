import React from 'react'
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
  Zoom,
} from '@mui/material'
import Button from '@mui/material/Button'
import PropTypes from 'prop-types'
import DetailsPopper from './DetailsPopper'
import MoleculeInfo from '../molecules/MoleculeInfo'
import AddIcon from '@mui/icons-material/Add'
import InfoIcon from '@mui/icons-material/Info'

/**
 * List of given elements with corresponding avatars and description text
 * @param updateFunc state function used to inform parent components of current selection
 * @param elements array of elements to be displayed
 * @param elementType string describing element type
 * @param usePopper boolean whether a descriptive popper should appear
 * @param addFunc function to be called when using add button
 * @param height string setting height of the list (ex: 88vh)
 * @param forcedSelectedIndex index set by parent component
 * @returns {JSX.Element}
 */
export default function SelectionList({
  updateFunc,
  elements,
  elementType,
  usePopper,
  addFunc,
  height,
  forcedSelectedIndex,
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(forcedSelectedIndex)
  const [open, setOpen] = React.useState(false)
  const [content, setContent] = React.useState(<h1>Placeholder</h1>)
  const [anchor, setAnchor] = React.useState(null)
  const theme = useTheme()

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
  }

  React.useEffect(() => {
    setSelectedIndex(forcedSelectedIndex)
  }, [forcedSelectedIndex])

  /**
   * Handler for Index Changes (aka list item clicks & "New"-Button clicks)
   * updates parent component's state if necessary
   * @param index of clicked item
   */
  const handleIndexChange = (index) => {
    setSelectedIndex(index)
    if (updateFunc !== undefined) updateFunc(index)
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
          <Button
            aria-label="Add item"
            onClick={() => {
              handleIndexChange(-1)
              addFunc()
            }}
          >
            <AddIcon sx={{ mr: 1 }} /> Add a {elementType}
          </Button>
        </CardActions>
        {elements.length === 0 ? (
          <Zoom in>
            <Typography
              display="flex"
              justifyContent="center"
              sx={{
                color: theme.palette.text.secondary,
                m: 2,
                mt: 3,
                whiteSpace: 'pre-line',
                textAlign: 'center',
                transition: 'all 1s linear',
              }}
            >
              {`You have created no ${elementType}s yet.\nClick on the button above to configure one!`}
            </Typography>
          </Zoom>
        ) : (
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {elements.map((element, index) => (
              <ListItemButton
                key={index + element.name}
                onClick={() => {
                  handleIndexChange(index)
                }}
                selected={selectedIndex === index}
              >
                <ListItemText primary={element.name} />
                {usePopper ? (
                  <PopperButton
                    element={element}
                    onClickFunc={handlePopper}
                    anchor={anchor}
                  />
                ) : null}
              </ListItemButton>
            ))}
          </List>
        )}
        <DetailsPopper
          anchor={anchor}
          open={open}
          content={content}
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
  forcedSelectedIndex: PropTypes.any,
}

SelectionList.defaultProps = {
  height: '7vh',
  forcedSelectedIndex: -1,
}

/**
 * popper button
 * @param element Object the list entry represents (i.e. a specific molecule)
 * @param onClickFunc Function that's called when the Button is clicked
 * @param anchor Anchor Element for the popper
 */
function PopperButton({ element, onClickFunc, anchor }) {
  return (
    <IconButton
      aria-label="info"
      color="primary"
      onClick={(event) => {
        onClickFunc(
          event.currentTarget,
          <MoleculeInfo molecule={element}></MoleculeInfo>,
          event.currentTarget !== anchor || !open
        )
        event.stopPropagation()
        event.preventDefault()
      }}
    >
      <InfoIcon />
    </IconButton>
  )
}

PopperButton.propTypes = {
  element: PropTypes.any,
  onClickFunc: PropTypes.func,
  anchor: PropTypes.any,
}
