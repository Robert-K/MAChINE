import React from 'react'
import logo from '../logo.svg'
import Score from '../ScoreComponent'

export default function Start() {
  const [displayText, setDisplayText] = React.useState('Initial')
  const receiveText = (receivedText) => {
    setDisplayText(receivedText)
  }
  return (
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
        {displayText}
      </a>
      <br></br>
      <Score sendTextToParent={receiveText} />
    </header>
  )
}
