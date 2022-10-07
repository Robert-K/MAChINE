import React from 'react'
import { Badge, badgeClasses, IconButton, Popover } from '@mui/material'
import LanIcon from '@mui/icons-material/Lan'
import api from '../../api'
import ServerConfigForm from './ServerConfigForm'
import UserContext from '../../context/UserContext'

/**
 * Button to monitor server connectivity
 * @returns {JSX.Element}
 */
export default function ServerStatusButton() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [color, setColor] = React.useState('error')
  const { adminMode } = React.useContext(UserContext)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // TODO: should open not be a state? or rather, why do you need the id?
  const open = Boolean(anchorEl && adminMode)
  const id = open ? 'simple-popover' : undefined

  function updateColor() {
    setColor(api.getConnectionStatus() ? 'connected' : 'error')
  }

  setInterval(updateColor, 1000)

  return (
    <div>
      <IconButton
        sx={{ color: 'white' }}
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        <Badge
          variant="dot"
          color={color}
          sx={{
            [`& .${badgeClasses.dot}`]: {
              width: 12,
              height: 12,
              borderRadius: '50%',
              border: '2px solid white',
            },
          }}
        >
          <LanIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <ServerConfigForm
          onChangeSubmit={() => {
            updateColor()
            setAnchorEl(null)
          }}
        />
      </Popover>
    </div>
  )
}
