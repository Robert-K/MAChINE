import React, { useState } from 'react'
import Scoreboards from './routes/Scoreboards.js'
import Models from './routes/Models'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Swagger from './routes/Swagger'
import '@fontsource/roboto'
import Navbar from './components/Navbar'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { red } from '@mui/material/colors'
import Home from './routes/Home'
import Molecules from './routes/Molecules'

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
            <Route path="/" element={<Home />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/models" element={<Models />}></Route>
            <Route path="/molecules" element={<Molecules />}></Route>
            <Route path="/results" element={<Scoreboards />}></Route>
            <Route path="/swagger" element={<Swagger />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App
