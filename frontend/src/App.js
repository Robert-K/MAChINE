import React from 'react'
import logo from './logo.svg'
import './App.css'
import 'bootswatch/dist/vapor/bootstrap.min.css'
import {
  Navbar,
  Container,
  NavDropdown,
  Nav,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap'
import Score from './ScoreComponent.js'

function App() {
  // api.getUserGreeting('James')
  const [displayText, setDisplayText] = React.useState('Initial')
  const receiveText = (receivedText) => {
    setDisplayText(receivedText)
  }
  return (
    <div className="App">
      <Navbar
        className="navbar navbar-dark bg-primary navbar-expand-lg"
        expand="md"
        variant="dark"
        bg="primary"
      >
        <Container fluid>
          <Navbar.Brand href="#home">
            <img
              src={logo}
              width="30"
              height="30"
              alt="logo"
              className="mx-3"
            />
            MAChINE
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something else
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
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
