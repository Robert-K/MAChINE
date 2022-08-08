import React from 'react'
import logo from '../logo.svg'
import Image from 'mui-image'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Grid,
  Stack,
  Typography,
  styled,
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
          maxWidth: 250,
          p: 4,
        }}
      >
        <Image sx={{ filter: 'invert(50%)' }} src={logo} />
      </Box>
      <HelpPanel />
      <Stack direction="row" justifyContent="space-evenly" spacing={0}>
        <Button
          aria-label="Result"
          onClick={() => setSelection('download')}
          endIcon={<DownloadIcon />}
        >
          Take your work home
        </Button>
        <Button
          aria-label="Info"
          onClick={() => setSelection('info')}
          startIcon={<InfoIcon />}
        >
          About us
        </Button>
      </Stack>
      <SelectedPanel selected={selection} />
    </div>
  )
}

function SelectedPanel({ selected }) {
  switch (selected) {
    case 'info':
      return InfoPanels()
    case 'download':
      return DownloadPanel()
  }
}

function HelpPanel() {
  const [open, setOpen] = React.useState([false, false, false, false])

  const changeCollapsed = (index) => {
    const newOpen = [...open]
    newOpen[index] = !open[index]
    setOpen(newOpen)
  }

  const TextButton = styled(Button)(() => ({
    background: 'none',
    border: 'none',
    textTransform: 'none',
  }))

  // TODO: Rewrite help text when done with everything (also do something about that alignment)
  return (
    <Box sx={{ maxWidth: 600, m: 3 }}>
      <Typography variant="h6" align="center" color="text.primary" paragraph>
        New here? Then learn here how to use this website:
      </Typography>
      <Typography align="center" color="text.secondary">
        Our website allows you to do five things:
      </Typography>
      <Typography align="center" color="text.secondary" paragraph>
        (Click on them to get a more detailed explanation)
      </Typography>

      <Grid container>
        {/* 1. Model creation */}
        <Typography
          align="left"
          color="text.primary"
          component={TextButton}
          onClick={() => changeCollapsed(0)}
        >
          1. Create your own machine learning model(s)
        </Typography>
        <Collapse in={open[0]} timeout="auto" orientation="vertical">
          <Typography align="left" color="text.secondary" paragraph>
            {`You do this by clicking "Models" in the Navbar and clicking "Add a Model"`}
            <br />
            Then simply select a base model, change some properties, et voilà,
            your own model
          </Typography>
        </Collapse>

        {/* 2. Model training */}
        <Typography
          align="left"
          color="text.primary"
          component={TextButton}
          onClick={() => changeCollapsed(1)}
        >
          2. Train your machine learning model(s)
        </Typography>

        <Collapse in={open[1]} timeout="auto" orientation="vertical">
          <Typography align="left" color="text.secondary" paragraph>
            You need to have a model to do this!
            <br />
            {`Select "Models" in the Navbar and click on one of your models`}
            <br />
            {`Click on one of your models, then on "Select Training Data" in the new overview`}
            <br />
            Select one of the Datasets a label and start training!
            <br />
            Your trained models will appear in your model overview
          </Typography>
        </Collapse>

        {/* 3. Molecule creation */}
        <Typography
          align="left"
          color="text.primary"
          component={TextButton}
          onClick={() => changeCollapsed(2)}
        >
          3. Draw custom molecule(s)
        </Typography>

        <Collapse in={open[2]} timeout="auto" orientation="vertical">
          <Typography align="left" color="text.secondary" paragraph>
            {`Click "Molecules" in the Navbar and click "Add a Molecule"`}
            <br />
            Your Molecule Editor will now be blank, try it out and create
            something beautiful!
            <br />
            {`When you're done, enter a name and click on "Save" to keep your molecule`}
          </Typography>
        </Collapse>

        {/* 4. Molecule analysis */}
        <Typography
          align="left"
          color="text.primary"
          component={TextButton}
          onClick={() => changeCollapsed(3)}
        >
          4. Predict properties of your molecule
        </Typography>

        <Collapse in={open[3]} timeout="auto" orientation="vertical">
          <Typography align="left" color="text.secondary" paragraph>
            You need to have a trained model (aka fitting) and a molecule to do
            this!
            <br />
            Navigate to the Molecule page
            <br />
            {`Select one of your molecules in the list and click on "Analyze"`}
            <br />
            Choose one of your trained models
            <br />
            You will now see your predicted properties!
          </Typography>
        </Collapse>
      </Grid>
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
      <Grid item>
        <Card>
          <CardMedia
            component="img"
            height="230"
            image="aimat_logo_purple.png"
            alt="dark purple"
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
      <Grid item>
        <Card>
          <CardMedia
            component="img"
            height="230"
            image="MsG_Logo_Flat.png"
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
