import React from 'react'
import Scoreboards from './routes/Scoreboards.js'
import './App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Swagger from './routes/Swagger'
import '@fontsource/roboto'
import Navbar from './components/Navbar'
import { createTheme, ThemeProvider } from '@mui/material'
import { red } from '@mui/material/colors'
import Home from './routes/Home'
import Molecules from './routes/Molecules'

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
})

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/models" element={<Home />}></Route>
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
