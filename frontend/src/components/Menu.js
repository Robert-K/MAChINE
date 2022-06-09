import React from 'react'
import logo from '../logo.svg'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const MenuStyle = styled.div`
  position: static;
  top: 0;
  right: 0;
  height: max-content;
  width: 100%;
  background-color: rgba(140, 65, 240, 0.8);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  vertical-align: middle;
`

const LinkStyle = styled(Link)`
  color: rgba(250, 200, 250, 1);
  font-size: medium;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-decoration: none;

  &:hover {
    transition: 0.15s all ease-in-out;
    color: rgba(255, 255, 255, 1);
  }
`

export default function Menu() {
  return (
    <MenuStyle>
      <img src={logo} width="30" height="30" alt="logo" className="mx-3" />
      <LinkStyle to="/home">Home</LinkStyle>
      <LinkStyle to="/models">Models</LinkStyle>
      <LinkStyle to="/molecules">Molecules</LinkStyle>
      <LinkStyle to="/results">Results</LinkStyle>
    </MenuStyle>
  )
}
