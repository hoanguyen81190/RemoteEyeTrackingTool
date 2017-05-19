import React from 'react';
import s from './InstructionsComponent.css';

import store from '../../core/store';
import CalibrationComponent from '../../core/calibrationComponent';

import history from '../../core/history';

var key = require('keymaster');

//Used for the trial instructions
class TrialInstructions extends React.Component {
  constructor(props){
    super(props);

    if(this.props.finished){
      this.handleHome = this.onHomeClicked.bind(this);
    }
    else{
      this.handleNextState = this.nextState.bind(this);
    }
  }

  componentDidMount() {
    if(!this.props.finished){
      key.setScope('instructions');
      key(this.props.nextKey, 'instructions', this.handleNextState);
    }
  }

  componentWillUnmount(){
    if(!this.props.finished){
      key.deleteScope('instructions');
    }
   }

   onHomeClicked(){
     history.push("/");
   }

  render() {
    let calibrationButton = null;
    if(this.props.calibration){
      calibrationButton = <CalibrationComponent/>
    }

    let finishedButton = null;
    if(this.props.finished){
      finishedButton = <button className={s.homeButton} onClick={this.handleHome}>Back to Home</button>;
    }

    return (
      <div className={s.container}>
        <div className={s.instructionsWrapper}>{this.props.instructions}</div>
        {calibrationButton}
        {finishedButton}
      </div>
    );
  }

  nextState(){
    this.props.stateCallback(this.props.callbackState);
    return false; //Prevents bubbling of the event
  }
}

export default TrialInstructions;
