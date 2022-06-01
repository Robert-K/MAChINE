import styled from 'styled-components'

export const TableStyle = styled.table`
  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid white;
  }
  th {
    background: plum;
    border-bottom: 3px solid white;
    color: white;
    font-weight: bold;
  }
  td {
    width: 30%;
    color: white;
  }
  th,
  td {
    padding: 1em;
    text-align: center;
    :last-child {
      border-right: 0;
    }
    :first-child {
      width: 10%;
    }
  }
`
