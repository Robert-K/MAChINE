import React from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  useTheme,
} from '@mui/material'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import Image from 'mui-image'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

/**
 * Introductory page including credits, hints, links to core components
 * contains button to start onboarding
 * @param startOnboarding callback to initiate onboarding
 * @returns {JSX.Element}
 * @constructor
 */
export default function HomePage({ startOnboarding }) {
  const theme = useTheme()
  return (
    <Box sx={{ align: 'center', px: '20%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Box className="swing">
          <Image
            sx={{
              maxWidth: 250,
              p: 4,
            }}
            src={theme.home.mascot}
          />
        </Box>
        <Box>
          <Typography variant="h2">Hi! I&apos;m Molele!</Typography>
          <Typography variant="h6" color="text.secondary">
            Don&apos;t know how to get started?{' '}
            <Button
              variant="outlined"
              style={{
                fontSize: theme.typography.h6.fontSize,
                display: 'inline-block',
                textTransform: 'none',
              }}
              onClick={() => {
                startOnboarding()
              }}
            >
              Let me show you!
            </Button>
          </Typography>
        </Box>
      </Box>

      <Box sx={{ textAlign: 'left', mb: 8 }}>
        <Typography variant="h4" color="text.primary" paragraph component="div">
          With{' '}
          <span style={{ color: theme.palette.primary.main }}>MAChINE</span> you
          can:
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          component="div"
        >
          -{' '}
          <Box display="inline">
            <NavLink to="/molecules">
              <span style={{ color: theme.palette.text.primary }}>Draw</span>
            </NavLink>
          </Box>{' '}
          any molecule imaginable and preview it in 3D
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          component="div"
        >
          -{' '}
          <Box display="inline">
            <NavLink to="/models">
              <span style={{ color: theme.palette.text.primary }}>
                Configure
              </span>
            </NavLink>
          </Box>{' '}
          and train machine learning models to predict properties of molecules
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          component="div"
        >
          -{' '}
          <Box display="inline" color="text.primary">
            <NavLink to="/molecules">
              <span style={{ color: theme.palette.text.primary }}>Analyze</span>
            </NavLink>
          </Box>{' '}
          your molecules for various properties with the models you trained
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          component="div"
        >
          -{' '}
          <Box display="inline" color="text.primary">
            <NavLink to="/results">
              <span style={{ color: theme.palette.text.primary }}>Compare</span>
            </NavLink>
          </Box>{' '}
          your molecules and models to other users&apos; creations
        </Typography>
      </Box>
      <Box sx={{ mb: 12 }}>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          component="div"
        >
          To have individual components of MAChINE explained to you, click on
          the <HelpOutlineOutlinedIcon /> icon on the top right and then hover
          over the respective component with your mouse. To turn the
          explanations off, simply click on the button again.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2,1fr)',
          gap: 5,
          textAlign: 'left',
          mb: 5,
        }}
      >
        <Box>
          <Typography variant="h4" color="text.primary" paragraph>
            <span style={{ color: theme.palette.primary.main }}>MAChINE</span>{' '}
            was made for:
          </Typography>
          <Card>
            <CardMedia
              component="img"
              image="aimat_logo_purple.png"
              alt="dark purple"
              sx={{ p: 2, background: 'white' }}
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
                The AiMat (Artificial Intelligence for Materials sciences) group
                of KIT develops AI and machine learning solutions for the
                materials sciences and is the client for this web application.
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
        </Box>
        <Box sx={{ mt: 16 }}>
          <Typography variant="h4" color="text.primary" paragraph>
            by:
          </Typography>
          <Card>
            <CardMedia
              component="img"
              image="msg_logo_flat.png"
              alt="lightgreen"
            />
            <CardContent>
              <Typography gutterBottom varian="h5" component="div">
                Medium-sized Geckos
              </Typography>
              <Typography
                varaint="body2"
                color="text.secondary"
                sx={{ maxWidth: 300 }}
              >
                This PSE project was created by the &apos;Medium-sized
                Geckos&apos; group, which consists mostly of members of the
                O-Phase group &apos;Team Gecko&apos;.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                href="https://team-gecko.de/"
                target="_blank"
              >
                GECKO Homepage
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
      <style>{`
        .swing {
          animation: swing 5s ease-in-out infinite;
        }
        @keyframes swing {
          0% {
            transform: rotate(0deg);
          }
          4% {
            transform: rotate(15deg);
          }
          8% {
            transform: rotate(-10deg);
          }
          12% {
            transform: rotate(5deg);
          }
          16% {
            transform: rotate(-5deg);
          }
          20% {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </Box>
  )
}

HomePage.propTypes = {
  startOnboarding: PropTypes.func.isRequired,
}
