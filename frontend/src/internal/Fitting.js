// Model training process
import { Collapse, Divider, List, ListItem } from '@mui/material'
import React from 'react'
import Button from '@mui/material/Button'

class Fitting extends React.Component {
  constructor(model, dataset, epochs, accuracy) {
    super([model, dataset, epochs, accuracy])
    // Name of fitted model, string
    this.model = model
    // Dataset identifier, string
    this.dataset = dataset
    // Amount of epochs model was trained for, integer
    this.epochs = epochs
    // Accuracy of fitting, integer
    this.accuracy = accuracy
    this.state = { open: false }
    // this.toggleOpen = this.toggleOpen.bind(this)
  }

  componentDidMount() {
    console.log('fitting mounted')
  }

  // toggleOpen() {}

  render() {
    // TODO: separate data from rendering, call rendering component and pass data
    // const [open, setOpen] = React.useState(false)
    return (
      <ListItem>
        {/* TODO: connect style to theme */}
        <style>{`
          .listKey {
            font-weight: bold;
            color: red;
          }
        `}</style>
        <Button onClick={() => this.setState({ open: !this.state.open })}>
          <div className="listKey"> {this.dataset} </div>
        </Button>
        <Collapse in={this.state.open}>
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
      </ListItem>
    )
  }

  toString() {
    return `${this.model} ${this.dataset} ${this.epochs} ${this.accuracy}`
  }
}
export default Fitting
