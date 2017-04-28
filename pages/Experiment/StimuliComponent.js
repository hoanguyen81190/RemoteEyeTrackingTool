import React, { PropTypes } from 'react';
import s from './StimuliComponent.css';

import store from '../../core/store';

var key = require('keymaster');

class Instructions extends React.Component {
  constructor(){
    super();
    this.handleTruePressed = this.truePressed.bind(this);
    this.handleFalsePressed = this.falsePressed.bind(this);
    this.handleAlarmPressed = this.alarmPressed.bind(this);
  }

  componentDidMount() {
    key.setScope('stimuli');
    let storeState = store.getState();
    key(storeState.trueKey, 'stimuli', this.handleTruePressed);
    key(storeState.falseKey, 'stimuli', this.handleFalsePressed);
    key(storeState.alarmKey, 'stimuli', this.handleAlarmPressed);
  }

  componentWillUnmount(){
    key.deleteScope('stimuli');
   }

  render() {
    return (
      <div className={s.container}>
        <div className={s.instructionsWrapper}>{this.props.instructions}</div>
      </div>
    );
  }

  alarmPressed(){
    // this.props.stateCallback("Instructions");
    console.log("Alarm pressed");
    return false; //Prevents bubbling of the event
  }

  truePressed(){
    console.log("True pressed");
    return false; //Prevents bubbling of the event
  }

  falsePressed(){
    console.log("False pressed");
    return false; //Prevents bubbling of the event
  }
}

export default Instructions;
