import React from 'react'
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  TextField,
  useTheme,
  CircularProgress,
} from '@mui/material'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

/**
 * Login Page, queries username and initiates login
 * on successful login, navigates to HomePage
 * @param onLogin
 * @returns {JSX.Element}
 * @constructor
 */
export default function StartPage({ onLogin }) {
  const [enteredName, setEnteredName] = React.useState('')
  const [connecting, setConnecting] = React.useState(false)
  const [connectionFailed, setConnectionFailed] = React.useState(false)
  const theme = useTheme()
  const navigate = useNavigate()

  const updateName = (text) => {
    setEnteredName(text)
  }

  const submitName = () => {
    setConnecting(true)
    setConnectionFailed(false)
    onLogin(enteredName).then((result) => {
      setConnecting(false)
      if (result) {
        navigate('/home')
      } else {
        setConnectionFailed(true)
      }
    })
  }

  return (
    <Box sx={{ m: 5 }}>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgColor: theme.palette.background,
            pt: 8,
            pb: 6,
          }}
        >
          <Container
            maxWidth="md"
            sx={{
              borderRadius: 1,
              borderTop: 0,
              borderRight: 0,
              borderStyle: 'dashed',
              borderColor: theme.palette.primary.main,
            }}
          >
            <Box>
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                MAChINE
              </Typography>
              <Typography
                component="h1"
                variant="h8"
                gutterBottom
                align="center"
                color={theme.palette.primary.main}
              >
                {`-It's neat-`}
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                {`How toxic is your favourite food additive?
                  Don't know? How about we find out!
                  We're taking you on a journey through molecular science and AI, using innovative, new technology to find answers to the real questions,
                  like "Is water a metal?" or "How flammable is my neighbour?"
                  Enter your name below and press the button to begin!
                `}
              </Typography>
            </Box>
          </Container>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={4}
            justifyContent="center"
          >
            <TextField
              label="Your name"
              value={enteredName}
              autoFocus
              onChange={(e) => updateName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && enteredName) submitName()
              }}
              inputProps={{ maxLength: 42 }}
            ></TextField>
            <Button
              disabled={!enteredName}
              variant="contained"
              onClick={() => submitName()}
            >
              Start your journey!
            </Button>
          </Stack>
          {/* Connecting... text */}
          <Stack
            direction="row"
            spacing={4}
            justifyContent="center"
            sx={{ pt: 4 }}
          >
            {connecting ? <CircularProgress></CircularProgress> : null}
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                {connecting ? 'connecting...' : ''}
                {connectionFailed
                  ? 'Login failed. Please try again later or use a different name'
                  : ''}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </main>
    </Box>
  )
}

StartPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
}
