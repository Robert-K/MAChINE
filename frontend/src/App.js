import React, { useState } from 'react'
import ScoreboardsPage from './routes/ScoreboardsPage.js'
import ModelsPage from './routes/ModelsPage.js'
import ModelConfigPage from './routes/ModelConfigPage.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SwaggerPage from './routes/SwaggerPage'
import '@fontsource/roboto'
import Navbar from './components/Navbar'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import HomePage from './routes/HomePage'
import MoleculesPage from './routes/MoleculesPage'
import StartPage from './routes/StartPage'
import TrainingPage from './routes/TrainingPage'
import DarkModeButton from './components/DarkModeButton'
import BaseModelsPage from './routes/BaseModelsPage'
import DatasetPage from './routes/DatasetPage'
import TrainedModels from './routes/TrainedModels'

const themeLight = createTheme({
  palette: {
    primary: {
      main: '#137C83',
    },
    contrastbackground: {
      main: '#137C83',
    },
  },
})

const themeDark = createTheme({
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
  },
})

function App() {
  const [userName, setUserName] = React.useState('')
  const login = (userName) => {
    logout()
    setUserName(userName)
    /* Do things */
  }
  const logout = () => {
    setUserName('')
    /* Delete all Data */
    /* Delete trained models */
    /* Delete molecules */
  }

  const [darkMode, setDarkMode] = useState(false)
  const changeDarkMode = (value) => {
    setDarkMode(value)
  }

  return (
    <div className="App">
      <ThemeProvider theme={darkMode ? themeDark : themeLight}>
        <CssBaseline />
        <BrowserRouter>
          <Navbar
            userName={userName}
            logoutFunction={logout}
            darkModeButton={<DarkModeButton setModeFunction={changeDarkMode} />}
          />
          <Routes>
            <Route
              path="/"
              element={<StartPage sendNameAway={login} />}
            ></Route>
            <Route path="/home" element={<HomePage />}></Route>
            <Route path="/modelconfig" element={<ModelConfigPage />}></Route>
            <Route path="/models" element={<ModelsPage />}></Route>
            <Route path="/molecules" element={<MoleculesPage />}></Route>
            <Route path="/results" element={<ScoreboardsPage />}></Route>
            <Route path="/swagger" element={<SwaggerPage />}></Route>
            <Route path="/training" element={<TrainingPage />}></Route>
            <Route path="/trained-models" element={<TrainedModels />}></Route>
            <Route path="/base-models" element={<BaseModelsPage />}></Route>
            <Route path="/datasets" element={<DatasetPage />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App
