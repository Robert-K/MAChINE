import React from 'react'
import Scoreboards from './routes/Scoreboards.js'
import './App.scss'
import Topbar from './components/Topbar'
import Start from './routes/Start.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  // api.getUserGreeting('James')

  return (
    <div className="App">
      <BrowserRouter>
        <Topbar />
        <Routes>
          <Route path="/" element={<Start />}></Route>
          <Route path="/molecule" element={<Start />}></Route>
          <Route path="/dataset" element={<Start />}></Route>
          <Route path="/train" element={<Start />}></Route>
          <Route path="/results" element={<Scoreboards />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
