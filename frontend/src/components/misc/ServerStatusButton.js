import * as React from 'react'
import Popover from '@mui/material/Popover'
import LanIcon from '@mui/icons-material/Lan'
import ServerConfigForm from './ServerConfigForm'
import { Badge, IconButton } from '@mui/material'
import api from '../../api'
export default function ServerStatusButton() {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [color, setColor] = React.useState('error')

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  setInterval(() => {
    setColor(api.getConnectionStatus() ? 'success' : 'error')
  }, 1000)

  return (
    <div>
      <IconButton
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        <Badge variant="dot" color={color}>
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
        <ServerConfigForm />
      </Popover>
    </div>
  )
}
