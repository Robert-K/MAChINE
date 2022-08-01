import { Box, IconButton, TextField } from '@mui/material'
import RestoreIcon from '@mui/icons-material/Restore'
import React from 'react'
import Button from '@mui/material/Button'
import api from '../api'

export default function ServerConfigForm() {
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
    <Box
      component="form"
      onSubmit={setValues}
      sx={{
        m: 2,
      }}
    >
      <IconButton
        sx={{ pr: 1 }}
        onClick={() => {
          getDefaults()
        }}
      >
        <RestoreIcon />
      </IconButton>
      <TextField
        type="text"
        label="IP Address"
        size="small"
        value={address}
        inputProps={{
          minLength: 7,
          maxLength: 15,
          size: 12,
          pattern:
            '^((\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])$',
        }}
        sx={{ pr: 1 }}
        onChange={handleAddressChange}
        error={
          !address.match(
            '^((\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])$'
          )
        }
      />
      <TextField
        type="number"
        label="Port"
        size="small"
        value={port}
        inputProps={{ size: 5 }}
        sx={{ pr: 1 }}
        onChange={handlePortChange}
        error={!(port > 0 && port <= 8000)}
      />
      <Button variant="outlined" type="submit">
        Set
      </Button>
    </Box>
  )

  function getDefaults() {
    setAddress(api.getDefaultAddress())
    setPort(api.getDefaultPort())
  }

  function setValues(event) {
    event.preventDefault()
    if (validIP && validPort) {
      api.setServerAddress(address)
      api.setServerPort(port)
    }
  }
}
