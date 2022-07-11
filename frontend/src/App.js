import React from 'react'
import Scoreboards from './routes/Scoreboards.js'
import './App.scss'
import Start from './routes/Start.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Swagger from './routes/Swagger'
import '@fontsource/roboto'
import Navbar from './components/Navbar'
import { createTheme, ThemeProvider } from '@mui/material'
import { red } from '@mui/material/colors'
import Molecules from './routes/Molecules'
import Models from './routes/Models'
import BaseModels from './routes/BaseModels'
import DatasetPage from './routes/DatasetPage'
import TrainedModels from './routes/TrainedModels'

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
            <Route path="/" element={<Start />}></Route>
            <Route path="/home" element={<Start />}></Route>
            <Route path="/models" element={<Models />}></Route>
            <Route path="/molecules" element={<Molecules />}></Route>
            <Route path="/results" element={<Scoreboards />}></Route>
            <Route path="/swagger" element={<Swagger />}></Route>
            <Route path="/base-models" element={<BaseModels />}></Route>
            <Route path="/datasets" element={<DatasetPage />}></Route>
            <Route path="/trained-models" element={<TrainedModels />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  )
}

export default App
