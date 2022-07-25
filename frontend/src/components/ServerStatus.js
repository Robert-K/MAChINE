import { Box, IconButton, List, ListItem, TextField } from '@mui/material'
import RestoreIcon from '@mui/icons-material/Restore'
import React from 'react'
import Button from '@mui/material/Button'
import api from '../api'

export default function ServerStatus() {
  const [address, setAddress] = React.useState(api.getServerAddress())
  const [port, setPort] = React.useState(api.getServerPort)
  const [validIP, setValidIP] = React.useState(true)
  const [validPort, setValidPort] = React.useState(true)

  const handleAddressChange = (event) => {
    setAddress(event.target.value)
    setValidIP(!event.target.error)
  }

  const handlePortChange = (event) => {
    setPort(event.target.value)
    setValidPort(!event.target.error)
  }

  return (
    <div>
      <List>
        <ListItem>
          <Box>
            <IconButton
              sx={{ m: 2 }}
              onClick={() => {
                getDefaults()
              }}
            >
              <RestoreIcon />
            </IconButton>
            <TextField
              type="text"
              label="IP Address"
              value={address}
              onChange={handleAddressChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setValues()
                }
              }}
              // minlength="7"
              // maxlength="15"
              // size="15"
              // pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"
              error={
                !address.match(
                  '^((\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])$'
                )
              }
              sx={{ m: 1 }}
            />
            <TextField
              type="number"
              label="Port"
              value={port}
              onChange={handlePortChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setValues()
                }
              }}
              error={!(port > 0 && port <= 8000)}
              sx={{ m: 1 }}
            />
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              onClick={() => {
                setValues()
              }}
            >
              Set
            </Button>
          </Box>
        </ListItem>
      </List>
    </div>
  )

  function getDefaults() {
    setAddress(api.getDefaultAddress())
    setPort(api.getDefaultPort())
  }

  function setValues() {
    if (validIP && validPort) {
      api.setServerAddress(address)
      api.setServerPort(port)
    }
  }
}
