import React from 'react'
import logo from './logo.svg'
import './App.css'
import SidebarMenu from 'react-bootstrap-sidebar-menu'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootswatch/dist/vapor/bootstrap.min.css'
import Score from './ScoreComponent.js'

function App() {
  // api.getUserGreeting('James')
  const [displayText, setDisplayText] = React.useState('Initial')
  const receiveText = (receivedText) => {
    setDisplayText(receivedText)
  }
  return (
    <div className="App">
      <SidebarMenu>
        <SidebarMenu.Header>
          <SidebarMenu.Brand>
            <h1>MAChINE</h1>
          </SidebarMenu.Brand>
          <SidebarMenu.Toggle />
        </SidebarMenu.Header>
      </SidebarMenu>
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
    </div>
  )
}

export default App
