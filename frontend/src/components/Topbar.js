import {
  Button,
  Container,
  Form,
  FormControl,
  Nav,
  NavDropdown,
  Navbar,
} from 'react-bootstrap'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { LinkContainer } from 'react-router-bootstrap'
import logo from '../logo.svg'

export default function Topbar() {
  return (
    <Navbar
      className="navbar navbar-dark bg-primary navbar-expand-lg"
      expand="md"
      variant="dark"
      bg="primary"
    >
      <Container fluid>
        <Navbar.Brand href="#home">
          <img src={logo} width="30" height="30" alt="logo" className="mx-3" />
          MAChINE
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/molecule">
              <Nav.Link>Molecule</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/dataset">
              <Nav.Link>Dataset</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/train">
              <Nav.Link>Train</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/results">
              <Nav.Link>Results</Nav.Link>
            </LinkContainer>
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
          <Nav>
            <Nav.Link href="#coffee">
              <FontAwesomeIcon icon={faCoffee} className="me-2" />
              Coffee
            </Nav.Link>
          </Nav>
          <Form className="d-flex ms-3">
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
  )
}
