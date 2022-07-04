// Model training process
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
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
    return (
      <List>
        {/* TODO: connect style to theme */}
        <style>{`
          .listKey {
            font-weight: bold;
            color: red;
          }
        `}</style>
        <ListItemButton onClick={() => setOpen(!open)}>
          <div className="listKey"> {this.dataset} </div>
        </ListItemButton>
        <Collapse in={open}>
          <List>
            <ListItem>
              <div className="listKey">Epochs: </div> {this.epochs}
            </ListItem>
            <ListItem>
              <div className="listKey">Accuracy: </div> {this.accuracy}%
            </ListItem>
          </List>
        </Collapse>
        <Divider />
      </List>
    )
  }
}
export default Fitting
