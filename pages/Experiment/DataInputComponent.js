import React from 'react';
import s from './DataInputComponent.css';

import store from '../../core/store';

//Used for the trial instructions
class DataInput extends React.Component {
  constructor(props){
    super(props);
    this.handleData = this.onHandleData.bind(this);
    this.handleNextState = this.nextState.bind(this);
  }

  onHandleData(){
    let participantID = document.getElementById("participantIDInput").value;
    participantID = participantID.replace(/\D/g,''); //Remove any non digit chars
    if(participantID === ""){
      window.alert("Please enter a valid participant ID equal to or greater than 0");
      return;
    }
    else if(parseInt(participantID) < 0){
      window.alert("The participant ID must be 0 or greater");
      return;
    }

    let participantDataAction = {
      type: "SET_PARTICIPANT_ID",
      participantId: participantID
    }
    store.dispatch(participantDataAction);
    this.nextState();
  }

  render() {
    return (
      <div className={s.container}>
        <div className={s.formWrapper}>
          <div className={s.participantField}>
            Participant ID:
            <input className={s.fieldName} type="number" name="participantID" min="0" id="participantIDInput"/>
          </div>
          <input className={s.submitButton} type="submit" value="Submit" onClick={this.handleData}/>
        </div>
      </div>
    );
  }

  nextState(){
    this.props.stateCallback(this.props.callbackState);
    return false; //Prevents bubbling of the event
  }
}

export default DataInput;
