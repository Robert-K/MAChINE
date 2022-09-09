import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  Card,
  CardContent,
  Popper,
  TextField,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import SaveIcon from '@mui/icons-material/Save'
import HelpIcon from '@mui/icons-material/Help'

export default function SchNetConfig({ model }) {
  let delay = null
  const settableParameters = {
    Depth: {
      default: 2,
      min: 1,
      explanation: 'How many layers the net will have',
    },
    EmbeddingDimension: {
      default: 128,
      min: 1,
      explanation: 'Fuck if I know',
    },
    ReadoutSize: {
      default: 1,
      min: 1,
      explanation: 'Dimension of last layer?',
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

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [popperContent, setPopperContent] = React.useState('')

  const handlePopperOpen = (event, content) => {
    setAnchorEl(event.currentTarget)
    setPopperContent(content)
  }

  const handlePopperClose = () => {
    setAnchorEl(null)
    // setPopperContent('')
  }

  const open = Boolean(anchorEl)

  const theme = useTheme()

  function handlePopperOpenDelay(event, explanation) {
    handlePopperOpen(event, explanation)
    console.log('Delayyyyyy')
    console.log(explanation)
    console.log(event)
  }

  return (
    <Grid container>
      <Grid item xs={8}>
        Insert GNN image here
      </Grid>
      <Grid item xs={2}>
        <Card sx={{ m: 2, width: '100%' }}>
          <CardContent>
            <React.Fragment>
              {Object.entries(settableParameters).map(([key, value], i) => {
                return (
                  <React.Fragment key={i}>
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
                      onMouseOver={(e) => {
                        delay = setTimeout(
                          handlePopperOpenDelay(e, value.explanation),

                          100000
                        )
                        console.log('Over:')
                        console.log(delay)
                      }}
                      onMouseLeave={() => {
                        // clearTimeout(delay)
                        console.log('Leave:')
                        console.log(delay)
                        handlePopperClose()
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        mb: 2,
                      }}
                    />
                    <Popper
                      id="mouse-over-popper"
                      sx={{
                        pointerEvents: 'none',
                      }}
                      open={open}
                      anchorEl={anchorEl}
                      placement={'right'}
                      onClose={handlePopperClose}
                      disableRestoreFocus
                    >
                      <Box sx={{ border: 1 }}>
                        <HelpIcon />
                        {popperContent}
                      </Box>
                    </Popper>
                  </React.Fragment>
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
