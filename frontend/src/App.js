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
  const [darkMode] = useState(false)

  return (
    <div className="App">
      <ThemeProvider theme={darkMode ? themeDark : themeLight}>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
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
