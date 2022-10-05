import React, { useCallback, useEffect } from 'react'
import ScoreboardsPage from './routes/ScoreboardsPage.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SwaggerPage from './routes/SwaggerPage'
import '@fontsource/roboto'
import Navbar from './components/misc/Navbar'
import { CssBaseline, ThemeProvider } from '@mui/material'
import HomePage from './routes/HomePage'
import MoleculesPage from './routes/MoleculesPage'
import StartPage from './routes/StartPage'
import TrainingPage from './routes/TrainingPage'
import DarkModeButton from './components/misc/DarkModeButton'
import DatasetPage from './routes/DatasetPage'
import FittingsPage from './routes/FittingsPage'
import api from './api'
import { UserProvider } from './context/UserContext'
import { TrainingProvider } from './context/TrainingContext'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import HelpModeButton from './components/misc/HelpModeButton'
import { HelpProvider } from './context/HelpContext'
import { handleErrors } from './utils'
import '@fontsource/poppins'
import ModelCreationRouter from './routes/ModelCreationRouter'
import { STATUS } from 'react-joyride'
import Onboarding from './components/onboarding/Onboarding'
import { themeDark, themeLight } from './Theme'

export default function App() {
  const [darkMode, setDarkMode] = React.useState(
    window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [theme, setTheme] = React.useState(darkMode ? themeDark : themeLight)
  const [helpMode, setHelpMode] = React.useState(false)
  const [userName, setUserName] = React.useState(null)
  const [adminMode, setAdminMode] = React.useState(false)
  const [runOnboarding, setRunOnboarding] = React.useState(false)

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      setDarkMode(event.matches ? 'dark' : 'light')
    })

  const particlesInit = useCallback(async (engine) => {
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine)
  }, [])

  async function login(newUserName) {
    if (userName !== null) logout()
    // setRunOnboarding(true) // Uncomment to run onboarding on login
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
    setRunOnboarding(false)
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
    setTheme(value ? themeDark : themeLight)
  }

  const changeHelpMode = (value) => {
    setHelpMode(value)
  }

  handleErrors()

  const onboardingCallback = (data) => {
    const { action, index, status, type } = data
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunOnboarding(false)
    }
  }

  const pattern = ['a', 'd', 'm', 'i', 'n', 'm', 'o', 'd', 'e']
  let current = 0

  useEffect(() => {
    const keyHandler = function (event) {
      if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
        current = 0
        return
      }
      current++
      if (pattern.length === current && !adminMode) {
        setAdminMode(true)
        alert('You are now an admin!')
      }
    }
    document.addEventListener('keydown', keyHandler, false)
  }, [])

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <UserProvider value={{ userName, adminMode, setAdminMode }}>
          <HelpProvider value={{ helpMode, setHelpMode }}>
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
                  helpModeButton={
                    <HelpModeButton
                      initialHelpMode={helpMode}
                      setModeFunction={changeHelpMode}
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
                <Onboarding run={runOnboarding} callback={onboardingCallback} />
                <Routes>
                  <Route
                    path="/"
                    element={<StartPage onLogin={login} />}
                  ></Route>
                  <Route
                    path="/home"
                    element={
                      <HomePage
                        startOnboarding={() => {
                          setRunOnboarding(true)
                        }}
                      />
                    }
                  ></Route>
                  <Route
                    path="/models/*"
                    element={
                      <ModelCreationRouter
                        initSelectedIndex={runOnboarding ? 0 : -1}
                      />
                    }
                  ></Route>
                  <Route path="/molecules" element={<MoleculesPage />}></Route>
                  <Route path="/results" element={<ScoreboardsPage />}></Route>
                  <Route path="/swagger" element={<SwaggerPage />}></Route>
                  <Route path="/training" element={<TrainingPage />}></Route>
                  <Route
                    path="/trained-models"
                    element={<FittingsPage />}
                  ></Route>
                  <Route path="/datasets" element={<DatasetPage />}></Route>
                </Routes>
              </BrowserRouter>
            </TrainingProvider>
          </HelpProvider>
        </UserProvider>
      </ThemeProvider>
    </div>
  )
}
