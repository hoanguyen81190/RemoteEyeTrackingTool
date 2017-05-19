import React, { PropTypes } from 'react';
import s from './PracticeComponent.css';

var key = require('keymaster');

class PracticeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0
    };
    this.checkAnswer = this._checkAnswer.bind(this);
    this.handleNextState = this.nextState.bind(this);
  }

  componentDidMount() {
    key.setScope('instructions');
    key(this.props.responseKeys[this.state.number].key, 'instructions', this.checkAnswer);
  }

  componentWillUnmount(){
    key.deleteScope('instructions');
   }

  render() {
    var command = "Press '" + this.props.responseKeys[this.state.number].key + "' to response as '" + this.props.responseKeys[this.state.number].meaning + "'";
    return (<div className={s.container}>
      <div className={s.instructionsWrapper}>Practice Session <div className={s.command}>{command}</div></div>
    </div>);
  }

  _checkAnswer() {
    var nextState = this.state.number + 1;
    this.setState({number: nextState});
    if(nextState < 2) {
      key(this.props.responseKeys[this.state.number].key, 'instructions', this.checkAnswer);
    }
    else {
      key(this.props.responseKeys[this.state.number].key, 'instructions', this.handleNextState);
    }
  }

  nextState(){
    this.props.stateCallback(this.props.callbackState);
    return false; //Prevents bubbling of the event
  }
}

PracticeComponent.propTypes = {

}

export default PracticeComponent;
