import React from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Card, CardContent, TextField } from '@mui/material'
import Grid from '@mui/material/Grid'
import SaveIcon from '@mui/icons-material/Save'

export default function SchNetConfig({ model }) {
  const settableParameters = {
    Depth: {
      default: 2,
      min: 1,
    },
    EmbeddingDimension: {
      default: 128,
      min: 1,
    },
    ReadoutSize: {
      default: 1,
      min: 1,
    },
  }

  const [sizes, setSizes] = React.useState([
    settableParameters.Depth.default,
    settableParameters.EmbeddingDimension.default,
    settableParameters.ReadoutSize.default,
  ])
  const [sizesError, setSizesError] = React.useState([false, false, false])
  const handleChange = (event, i, min) => {
    const tempSizesError = event.target.value
    const sizesErrorClone = [...sizesError]
    sizesErrorClone[i] = tempSizesError < min
    setSizesError(sizesErrorClone)
    if (tempSizesError >= min) {
      const sizesClone = [...sizes]
      sizesClone[i] = event.target.value
      setSizes(sizesClone)
    }
  }

  return (
    <Grid container>
      <Grid item xs={8}>
        Insert GNN image here.
      </Grid>
      <Grid item xs={2}>
        <Card sx={{ m: 2, width: '100%' }}>
          <CardContent>
            <React.Fragment>
              {Object.entries(settableParameters).map(([key, value], i) => {
                return (
                  <TextField
                    key={i}
                    required
                    id="outlined-number"
                    label={key}
                    type="number"
                    defaultValue={value.default}
                    error={sizesError[i]}
                    helperText={sizesError[i] ? 'Must be above zero!' : ''}
                    onChange={(e) => handleChange(e, i, value.min)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      mb: 2,
                    }}
                  />
                )
              })}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: 1 }}>
                <Button
                  size="large"
                  variant="outlined"
                  type="submit"
                  endIcon={<SaveIcon />}
                  // todo make this prettier
                  disabled={sizesError[0] || sizesError[1] || sizesError[2]}
                >
                  {/** todo implement saving of model */}
                  Save
                </Button>
              </Box>
            </React.Fragment>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

SchNetConfig.propTypes = {
  model: PropTypes.object.isRequired,
}
