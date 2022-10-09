import React from 'react'
import { Badge, badgeClasses, IconButton, Popover } from '@mui/material'
import LanIcon from '@mui/icons-material/Lan'
import api from '../../api'
import ServerConfigForm from './ServerConfigForm'
import UserContext from '../../context/UserContext'

/**
 * Button to monitor server connectivity
 * only visible in Admin Mode
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

  function updateColor() {
    setColor(api.getConnectionStatus() ? 'connected' : 'error')
  }

  setInterval(updateColor, 1000)

  return (
    <div>
      <IconButton
        sx={{ color: 'white' }}
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
        open={Boolean(anchorEl && adminMode)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <ServerConfigForm
          onSubmitChange={() => {
            updateColor()
            setAnchorEl(null)
          }}
        />
      </Popover>
    </div>
  )
}
