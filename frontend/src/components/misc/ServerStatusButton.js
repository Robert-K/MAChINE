import * as React from 'react'
import Popover from '@mui/material/Popover'
import LanIcon from '@mui/icons-material/Lan'
import ServerConfigForm from './ServerConfigForm'
import { Badge, IconButton, badgeClasses } from '@mui/material'
import api from '../../api'
import UserContext from '../../context/UserContext'

export default function ServerStatusButton() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const { adminMode } = React.useContext(UserContext)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [color, setColor] = React.useState('error')

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
