import React, { useCallback } from 'react'
import ScoreboardsPage from './routes/ScoreboardsPage.js'
import ModelsPage from './routes/ModelsPage.js'
import ModelConfigPage from './routes/ModelConfigPage.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SwaggerPage from './routes/SwaggerPage'
import '@fontsource/roboto'
import Navbar from './components/misc/Navbar'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import HomePage from './routes/HomePage'
import MoleculesPage from './routes/MoleculesPage'
import StartPage from './routes/StartPage'
import TrainingPage from './routes/TrainingPage'
import DarkModeButton from './components/misc/DarkModeButton'
import BaseModelsPage from './routes/BaseModelsPage'
import DatasetPage from './routes/DatasetPage'
import FittingsPage from './routes/FittingsPage'
import api from './api'
import { UserProvider } from './context/UserContext'
import { TrainingProvider } from './context/TrainingContext'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import { deepmerge } from '@mui/utils'
import { handleErrors } from './utils'
import '@fontsource/poppins'

const themeBase = {
  palette: {
    connected: {
      main: '#6dcd00',
    },
  },
  typography: {
    fontFamily: `"Poppins", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 400,
  },
}

const themeLight = createTheme(
  deepmerge(themeBase, {
    palette: {
      primary: {
        main: '#137C83',
      },
      contrastbackground: {
        main: '#137C83',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(255, 255, 255, .2)',
            backdropFilter: 'blur(5px)',
            boxShadow:
              '0px 7px 8px -4px rgb(0 0 0 / 10%), 0px 12px 17px 2px rgb(0 0 0 / 8%), 0px 5px 22px 4px rgb(0 0 0 / 6%)',
          },
        },
      },
    },
    apexcharts: {
      shade: 'light',
    },
    modelVisual: {
      borderColor: '#c4c4c4',
      fontColor: '#212121',
      backgroundColor: '#ffffff',
    },
    home: {
      mascot: 'molele.svg',
    },
    darkTheme: false,
  })
)

const themeDark = createTheme(
  deepmerge(themeBase, {
    palette: {
      primary: {
        main: '#dc3984',
      },
      mode: 'dark',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: '#7E2E54',
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(30, 30, 30, .5)',
            backdropFilter: 'blur(5px)',
          },
        },
      },
    },
    apexcharts: {
      shade: 'dark',
    },
    modelVisual: {
      borderColor: '#707070',
      fontColor: 'white',
      backgroundColor: '#242424',
    },
    home: {
      mascot: 'molele-dark.svg',
    },
    darkMode: true,
  })
)

export default function App() {
  const [darkMode, setDarkMode] = React.useState(
    window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [userName, setUserName] = React.useState(null)

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      setDarkMode(event.matches ? 'dark' : 'light')
    })

  const particlesInit = useCallback(async (engine) => {
    console.log(engine)
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine)
  }, [])

  async function login(newUserName) {
    if (userName !== null) logout()
    return api
      .completeLogin(newUserName)
      .then((r) => {
        if (r) {
          setUserName(newUserName)
          return true
        }
        return false
      })
      .catch((e) => {
        console.log(e)
        return false
      })
  }

  const logout = () => {
    api.stopTraining()
    api.logout().catch((e) => console.log(e))
    setUserName(null)
    // TrainingsContext is reset in Navbar
    /* TODO: Delete all Data */
    /* TODO: Delete trained models */
    /* TODO: Delete molecules */
  }

  const changeDarkMode = (value) => {
    setDarkMode(value)
  }

  handleErrors()

  return (
    <div className="App">
      <ThemeProvider theme={darkMode ? themeDark : themeLight}>
        <UserProvider value={{ userName }}>
          <TrainingProvider>
            <CssBaseline />
            <BrowserRouter>
              <Navbar
                logoutFunction={logout}
                darkModeButton={
                  <DarkModeButton
                    initialDarkMode={darkMode}
                    setModeFunction={changeDarkMode}
                  />
                }
              />
              <Particles
                init={particlesInit}
                options={{
                  fullScreen: {
                    enable: true,
                    zIndex: -1000000,
                  },
                  particles: {
                    color: {
                      value: '#aaaaaa',
                    },
                    links: {
                      color: '#aaaaaa',
                      distance: 111,
                      enable: true,
                      opacity: 0.3,
                      width: 4,
                    },
                    move: {
                      direction: 'none',
                      enable: true,
                      outMode: 'bounce',
                      random: false,
                      speed: 0.2,
                      straight: false,
                    },
                    number: {
                      density: {
                        enable: true,
                        value_area: 800,
                      },
                      value: 30,
                    },
                    opacity: {
                      value: 0.3,
                    },
                    shape: {
                      type: 'circle',
                    },
                    size: {
                      random: true,
                      value: 7,
                    },
                  },
                  interactivity: {
                    events: {
                      onHover: {
                        enable: true,
                        mode: 'repulse',
                      },
                      resize: true,
                    },
                    modes: {
                      repulse: {
                        distance: 200,
                        factor: 0.77,
                        easing: 'ease-out-quad',
                      },
                    },
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<StartPage onLogin={login} />}></Route>
                <Route path="/home" element={<HomePage />}></Route>
                <Route
                  path="/modelconfig"
                  element={<ModelConfigPage />}
                ></Route>
                <Route path="/models" element={<ModelsPage />}></Route>
                <Route path="/molecules" element={<MoleculesPage />}></Route>
                <Route path="/results" element={<ScoreboardsPage />}></Route>
                <Route path="/swagger" element={<SwaggerPage />}></Route>
                <Route path="/training" element={<TrainingPage />}></Route>
                <Route
                  path="/trained-models"
                  element={<FittingsPage />}
                ></Route>
                <Route path="/base-models" element={<BaseModelsPage />}></Route>
                <Route path="/datasets" element={<DatasetPage />}></Route>
              </Routes>
            </BrowserRouter>
          </TrainingProvider>
        </UserProvider>
      </ThemeProvider>
    </div>
  )
}
