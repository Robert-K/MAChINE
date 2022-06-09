import React from 'react'
import api from './api.js'
import PropTypes from 'prop-types'

class ScoreComp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      score: 0,
      name: '',
    }
  }

  handleFormChange = (event) => {
    const target = event.target
    const targetName = target.name
    const value = target.value
    this.setState({
      [targetName]: value,
    })
  }

  handleDisplayText = (input) => {
    this.setState({ text: input })
    this.props.sendTextToParent(input)
  }

  render() {
    return (
      <div>
        <form>
          <input
            type="text"
            name="name"
            placeholder={'Enter Name'}
            value={this.state.name}
            onChange={(e) => this.handleFormChange(e)}
          ></input>
          <input
            type="number"
            name="score"
            placeholder={'Enter score'}
            value={this.state.score}
            onChange={(e) => this.handleFormChange(e)}
          ></input>
          <button
            onClick={() =>
              api
                .getUserGreeting(this.state.name)
                .then((data) => this.handleDisplayText(data))
            }
            size={'lg'}
            className="mb-2"
          >
            {'Get Greeting'}
          </button>
        </form>
        <div>
          <button
            onClick={() =>
              api
                .getUserScore(this.state.name)
                .then((data) =>
                  this.handleDisplayText(this.state.name + ' ' + data)
                )
            }
            size={'lg'}
            className="my-3"
          >
            Get Score
          </button>
          <button
            variant={'outline-info'}
            onClick={() => api.setUserScore(this.state.name, this.state.score)}
            size={'lg'}
            className="my-3"
          >
            {'Set ' + this.state.name + ' Score to ' + this.state.score}
          </button>
        </div>
      </div>
    )
  }
}

ScoreComp.propTypes = {
  sendTextToParent: PropTypes.func.isRequired,
}

export default ScoreComp
