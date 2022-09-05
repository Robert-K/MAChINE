import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardContent } from '@mui/material'

export default function SchNetConfig({ model }) {
  return (
    <Card>
      <CardContent>Put image of GNN here.</CardContent>
    </Card>
  )
}

SchNetConfig.propTypes = {
  model: PropTypes.object.isRequired,
}
