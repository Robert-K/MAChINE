import React from 'react'
import PropTypes from 'prop-types'
import { List, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function BaseModelInfo(props) {
  const navigate = useNavigate()
  return (
    <List sx={{ maxHeight: 400 }}>
      <Button
        fullWidth
        variant="contained"
        onClick={() => navigate('/modelconfig')}
      >
        Configure this model
      </Button>
    </List>
  )
}

BaseModelInfo.propTypes = {
  baseModel: PropTypes.object,
  compatibleDatasets: PropTypes.object,
  dataset: PropTypes.object,
}
