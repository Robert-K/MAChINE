import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import logo from '../logo.svg'

export default function Topbar() {
  return (
    <div
      className="navbar navbar-dark bg-primary navbar-expand-lg"
      expand="md"
      variant="dark"
      bg="primary"
    >
      <div fluid>
        <div href="#home">
          <img src={logo} width="30" height="30" alt="logo" className="mx-3" />
          MAChINE
        </div>
        <div aria-controls="basic-navbar-nav" />
        <div id="basic-navbar-nav">
          <div className="me-auto">
            <a>Home</a>
            <a>Molecule</a>
            <a>Train</a>
            <a>Scores</a>
            <a>Foo Bar</a>
            <div title="Dropdown" id="basic-nav-dropdown">
              <a href="#action/3.1">Action</a>
              <a href="#action/3.2">Another action</a>
              <a href="#action/3.3">Something else</a>
              <hr />
              <a href="#action/3.4">Separated link</a>
            </div>
          </div>
          <div>
            <a href="#coffee">
              <FontAwesomeIcon icon={faCoffee} className="me-2" />
              Coffee
            </a>
          </div>
          <div className="d-flex ms-3">
            <div
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <button variant="outline-success">Search</button>
          </div>
        </div>
      </div>
    </div>
  )
}
