import React from 'react';
import s from './InstructionsComponent.css';

import store from '../../core/store';

var key = require('keymaster');

//Used for the trial instructions
class TrialInstructions extends React.Component {
  constructor(props){
    super(props);
    this.handleNextState = this.nextState.bind(this);
  }

  componentDidMount() {
    key.setScope('instructions');
    key(this.props.nextKey, 'instructions', this.handleNextState);
  }

  componentWillUnmount(){
    key.deleteScope('instructions');
   }

  render() {
    return (
      <div className={s.container}>
        <div className={s.instructionsWrapper}>{this.props.instructions}</div>
      </div>
    );
  }

  nextState(){
    this.props.stateCallback(this.props.callbackState);
    return false; //Prevents bubbling of the event
  }
}

export default TrialInstructions;
