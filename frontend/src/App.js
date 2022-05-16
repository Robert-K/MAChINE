import React from 'react'
import logo from './logo.svg'
import './App.css'
import api from './api.js'
import SidebarMenu from 'react-bootstrap-sidebar-menu'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootswatch/dist/vapor/bootstrap.min.css'

function App() {
  // api.getUserGreeting('James')
  const [buttonText, setButtonText] = React.useState('Next')
  const changeText = (text) => setButtonText(text)
  return (
    <div className="App">
      <SidebarMenu>
        <SidebarMenu.Header>
          <SidebarMenu.Brand>{/* Your brand icon */}</SidebarMenu.Brand>
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
          Learn React
        </a>
        <Button
          onClick={() =>
            api.getUserGreeting('Woo').then((data) => changeText(data))
          }
          size={'lg'}
          className="my-3"
        >
          {buttonText}
        </Button>
        <Button variant={'outline-info'} onClick={() => changeText('Next')}>
          {'Reset'}
        </Button>
      </header>
    </div>
  )
}

export default App
