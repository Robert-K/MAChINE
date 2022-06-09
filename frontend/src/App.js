import React from 'react'
import Scoreboards from './routes/Scoreboards.js'
import './App.scss'
import Menu from './components/Menu'
import Start from './routes/Start.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  // api.getUserGreeting('James')

  return (
    <div className="App">
      <BrowserRouter>
        <Menu />
        <Routes>
          <Route path="/" element={<Start />}></Route>
          <Route path="/home" element={<Start />}></Route>
          <Route path="/models" element={<Start />}></Route>
          <Route path="/molecules" element={<Start />}></Route>
          <Route path="/results" element={<Scoreboards />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
