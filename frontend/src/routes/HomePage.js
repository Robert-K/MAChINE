import React from 'react'
import logo from '../logo.svg'
import Image from 'mui-image'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import InfoIcon from '@mui/icons-material/Info'
import Button from '@mui/material/Button'

export default function HomePage() {
  const [selection, setSelection] = React.useState(null)
  return (
    <div className="Home" align="center">
      <Box
        sx={{
          maxWidth: 350,
          p: 4,
        }}
      >
        <Image sx={{ filter: 'invert(50%)' }} src={logo} />
      </Box>
      <HelpPanel />
      <Stack direction="row" justifyContent="center" spacing={4}>
        <IconButton
          aria-label="Result"
          onClick={() => setSelection('download')}
        >
          <DownloadIcon />
        </IconButton>
        <IconButton aria-label="Info" onClick={() => setSelection('info')}>
          <InfoIcon />
        </IconButton>
      </Stack>
      <SelectedPanel selected={selection} />
    </div>
  )
}

function SelectedPanel(props) {
  switch (props.selected) {
    case 'info':
      return InfoPanels()
    case 'download':
      return DownloadPanel()
  }
}

function HelpPanel() {
  return (
    <Box sx={{ maxWidth: 600, m: 3 }}>
      <Typography variant="h6" align="center" color="text.primary" paragraph>
        New here? Then learn here how to use this website:
      </Typography>
      <Typography align="center" color="text.secondary" paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </Typography>
    </Box>
  )
}

function DownloadPanel() {
  return (
    <Box sx={{ m: 5 }}>
      <Box sx={{ fontWeight: 'bold' }}>
        Already done? Click down here to take your results home!
        (WUNSCHKRITERIUM)
      </Box>
      <Button variant="contained" sx={{ m: 2 }}>
        Generate PDF (WUNSCHKRITERIUM)
      </Button>
    </Box>
  )
}

function InfoPanels() {
  return (
    <Grid container spacing={2} justifyContent="center" sx={{ p: 3 }}>
      <Grid item sx={8}>
        <Card>
          <CardMedia
            component="img"
            height="230"
            image="https://aimat.iti.kit.edu/img/AiMat_logo_blue_transparent_rdax_168x76.png"
            alt="light green"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              AiMat
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 300 }}
            >
              Die AiMat (Artificial Intelligence for Materials Sciences) Gruppe
              des KIT entwickelt KI and machine learning Lösungen für die
              Materialwissenschaften und ist Auftraggeber für diese Webanwendung
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              href="https://aimat.iti.kit.edu/"
              target="_blank"
            >
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item sx={8}>
        <Card>
          <CardMedia
            component="img"
            height="230"
            image="https://yt3.ggpht.com/ytc/AKedOLRix_FfqEeSnt2jQ5mkymzvRAq9SQaZqulr3wGa=s88-c-k-c0x00ffffff-no-rj"
            alt="lightgreen"
          />
          <CardContent>
            <Typography gutterBottom varian="h5" component="div">
              Medium-sized GECKOs
            </Typography>
            <Typography
              varaint="body2"
              color="text.secondary"
              sx={{ maxWidth: 300 }}
            >
              Dieses Projekt wurde von der Gruppe <q>Medium-sized Geckos</q>{' '}
              erstellt, die größtenteils aus Mitgliedern der O-Phasengruppe{' '}
              <q>Team GECKO</q> besteht
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" href="https://team-gecko.de/" target="_blank">
              GECKO Homepage
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}
