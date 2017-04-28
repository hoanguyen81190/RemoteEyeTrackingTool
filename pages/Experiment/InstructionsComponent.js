import React from 'react';
import s from './InstructionsComponent.css';

import store from '../../core/store';

var key = require('keymaster');

class Instructions extends React.Component {
  constructor(){
    super();
    this.handleNextState = this.nextState.bind(this);
  }

  componentDidMount() {
    key.setScope('instructions');
    key(store.getState().instructionsKey, 'instructions', this.handleNextState);
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
    this.props.stateCallback("Blackscreen");
    return false; //Prevents bubbling of the event
  }
}

export default Instructions;
