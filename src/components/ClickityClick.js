// Code ClickityClick Component Here
import React, {Component} from 'react';

class ClickityClick extends Component {
  constructor() {
    super();
    //initial state set to false
    this.state = {
      hasBeenClicked: false,
    };
  }
  
  handleClick = () => {
    this.setState({ hasBeenClicked: true});
  }
  render() {
    return (
      <div>
        <p>I have {this.state.hasBeenClicked ? null : 'not'} been clicked!</p>
        <button onClick={this.handleClick}>Click me</button>
      </div>
    );
  }
}

export default ClickityClick;