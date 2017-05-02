import React, { PropTypes } from 'react';
import s from './StimuliComponent.css';

import store from '../../core/store';

import wamp from '../../core/wamp';

import AOI from './AOIComponent';

var key = require('keymaster');

class Instructions extends React.Component {
  constructor(props){
    super(props);
    this.handleTruePressed = this.truePressed.bind(this);
    this.handleFalsePressed = this.falsePressed.bind(this);
    this.handleAlarmPressed = this.alarmPressed.bind(this);

    this.handleAOIUpdate = this.updateAOIs.bind(this);

    this.aoiRefs = [];
    this.timerInterval = 2;

    this.firstRender = true;

    this.timeSinceStart = 0;
  }

  componentDidMount() {
    key.setScope('stimuli');
    let storeState = store.getState();
    key(storeState.trueKey, 'stimuli', this.handleTruePressed);
    key(storeState.falseKey, 'stimuli', this.handleFalsePressed);
    key(storeState.alarmKey, 'stimuli', this.handleAlarmPressed);

    //Timer to update all the AOIs in this stimuli component
    this.timer = setInterval(this.handleAOIUpdate, this.timerInterval);
  }

  componentWillUnmount(){
    key.deleteScope('stimuli');
    clearInterval(this.timer);
   }

  render() {

    if(this.firstRender){
      this.firstRender = false;
      let gazePathAction = {
        type: 'ADD_GAZE_PATH',
        gazePath: {
          category: "Seperator",
          eventStart: 0,
          eventEnd: "-",
          eventDuration: "-",
          fixationPos: {
            posX: "-",
            posY: "-"
          },
          aoiName: "-",
          image: "ImageName"
          //image: this.props.stimuli
        }
      }
      store.dispatch(gazePathAction);
    }

    this.aoiRefs = [];
    this.aoiRefs.push("test");
    return (
      <div className={s.container}>
        <div className={s.instructionsWrapper}>{this.props.instructions}</div>
        <div className={s.aoiWrapper}>
          <AOI topLeftX={500} topLeftY={500} width={100} height={100} visible={true} name="testAOI" ref="test"/>
        </div>
        <div className={s.dtimuliWrapper}>
          {/* <img src={this.props.stimuli}/> */}
        </div>
      </div>
    );
  }

  updateAOIs(){
    this.timeSinceStart += this.timerInterval;
    if(this.aoiRefs.length > 0){
      this.refs[this.aoiRefs[0]].onTick(this.timerInterval);
    }
  }

  alarmPressed(){
    console.log("Alarm pressed");

    this.dispatchKeyResponse(store.getState().alarmKey);

    return false; //Prevents bubbling of the event
  }

  truePressed(){
    console.log("True pressed");

    this.dispatchKeyResponse(store.getState().trueKey);

    return false; //Prevents bubbling of the event
  }

  falsePressed(){
    console.log("False pressed");

    this.dispatchKeyResponse(store.getState().falseKey);

    return false; //Prevents bubbling of the event
  }

  dispatchKeyResponse(keyPressed){
    let keyResponseAction = {
      type: 'ADD_KEY_RESPONSE',
      keyResponse: {
        keyPressed: keyPressed,
        eventStart: this.timeSinceStart,
        image: "ImageName"
        //image: "this.props.stimuli"
      }
    }
    store.dispatch(keyResponseAction);

    console.log(store.getState().keyResponses);
  }

  nextState(){
    this.props.stateCallback("Blackscreen");
  }
}

export default Instructions;
