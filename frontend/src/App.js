import React from 'react'
import { Button } from 'react-bootstrap'
import logo from './logo.svg'
import './App.css'
import api from './api.js'

function App () {
  // api.getUserGreeting('James')
  const [buttonText, setButtonText] = React.useState('Next')
  const changeText = (text) => setButtonText(text)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Button onClick={ () => api.getUserGreeting('Woo').then((data) => changeText(data)) }>{ buttonText }</Button>
        <Button onClick={ () => changeText('Next')}>{ 'Reset'}</Button>
      </header>
    </div>
  )
}

export default App
