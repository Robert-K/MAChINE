// Model training process
import {
  Collapse,
  Divider,
  List,
  ListItemButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import React from 'react'

class Fitting {
  constructor(model, dataset, epochs, accuracy) {
    // Name of fitted model, string
    this.model = model
    // Dataset identifier, string
    this.dataset = dataset
    // Amount of epochs model was trained for, integer
    this.epochs = epochs
    // Accuracy of fitting, integer
    this.accuracy = accuracy
  }

  render() {
    const [open, setOpen] = React.useState(false)
    const rows = [
      createData('Epochs', this.epochs),
      createData('Accuracy', this.accuracy),
    ]
    return (
      <List>
        <style>{`
          .listKey {
            font-weight: bold;
          }
        `}</style>
        <ListItemButton onClick={() => setOpen(!open)}>
          <Typography className="listKey" sx={{ color: 'primary.main' }}>
            {' '}
            {this.dataset}{' '}
          </Typography>
        </ListItemButton>
        <Collapse in={open}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }}>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.property}>
                    <TableCell component="th" scope="row">
                      {row.property}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
        <Divider />
      </List>
    )
  }
}

function createData(property, value) {
  return { property, value }
}

export default Fitting
