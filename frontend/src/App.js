import React from 'react'
import Scoreboards from './routes/Scoreboards.js'
import './App.scss'
import Start from './routes/Start.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Swagger from './routes/Swagger'

import '@fontsource/roboto'
import Navbar from './components/Navbar'

function App() {
  // api.getUserGreeting('James')

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Start />}></Route>
          <Route path="/home" element={<Start />}></Route>
          <Route path="/models" element={<Start />}></Route>
          <Route path="/molecules" element={<Start />}></Route>
          <Route path="/results" element={<Scoreboards />}></Route>
          <Route path="/swagger" element={<Swagger />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
