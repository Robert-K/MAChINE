import React, { useState } from 'react'
import ScoreboardsPage from './routes/ScoreboardsPage.js'
import ModelsPage from './routes/ModelsPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SwaggerPage from './routes/SwaggerPage'
import '@fontsource/roboto'
import Navbar from './components/Navbar'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { red } from '@mui/material/colors'
import HomePage from './routes/HomePage'
import MoleculesPage from './routes/MoleculesPage'
import StartPage from './routes/StartPage'

const themeLight = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
})

const themeDark = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
    mode: 'dark',
  },
})

function App() {
  const [userName, setUserName] = React.useState('')
  const login = (userName) => {
    setUserName(userName)
    /* Do things */
  }
  const logout = () => {
    setUserName('')
    /* Delete all Data */
    /* Delete trained models */
    /* Delete molecules */
  }

  const [darkMode] = useState(false)

  return (
    <div className="App">
      <ThemeProvider theme={darkMode ? themeDark : themeLight}>
        <CssBaseline />
        <BrowserRouter>
          <Navbar userName={userName} logoutFunction={logout} />
          <Routes>
            <Route
              path="/"
              element={<StartPage sendNameAway={login} />}
            ></Route>
            <Route path="/home" element={<HomePage />}></Route>
            <Route path="/models" element={<ModelsPage />}></Route>
            <Route path="/molecules" element={<MoleculesPage />}></Route>
            <Route path="/results" element={<ScoreboardsPage />}></Route>
            <Route path="/swagger" element={<SwaggerPage />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App
