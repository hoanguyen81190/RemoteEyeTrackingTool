import React, { PropTypes } from 'react';
import s from './StimuliComponent.css';

import store from '../../core/store';

import wamp from '../../core/wamp';

import AOI from './AOIComponent';

var key = require('keymaster');

const stimuliFolderImages = 'experiment/stimuli/'; //To read the images

class StimuliComponent extends React.Component {
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
    key(this.props.trueKey, 'stimuli', this.handleTruePressed);
    key(this.props.falseKey, 'stimuli', this.handleFalsePressed);
    key(this.props.alarmKey, 'stimuli', this.handleAlarmPressed);

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

      let gazePathAction =
      {
          aoiName: "-",
          category: "Seperator",
          eventStart: 0,
          eventEnd: "-",
          eventDuration: "-",
          fixationPos: {
            posX: "-",
            posY: "-"
          },
          // image: this.props.imageName
          image: "ImageName"
      }

      this.props.gazeDataCallback(gazePathAction)
    }

    this.aoiRefs = [];
    this.aoiRefs.push("test");

    let trialData = this.props.trialData;

    // currHSI: currHSI,
    // currQuestion: currHSIData.questions[this.questionIndex].question,
    // data: currTrial

    let trueInstruction = "Press " + trialData.data.responseKeys[0].key + ' for "'  + trialData.data.responseKeys[0].meaning + '"';
    let falseInstruction = "Press " + trialData.data.responseKeys[1].key + ' for "'  + trialData.data.responseKeys[1].meaning + '"';

    console.log(stimuliFolderImages+trialData.currHSI+"/"+trialData.currQuestion+"/"+trialData.data.image);

    return (
      <div className={s.container}>
        <div className={s.instructionsWrapper}>
          <div className={s.instructions}>{trialData.data.question}</div>
          <div className={s.trueText}>{trueInstruction}</div>
          <div className={s.falseText}>{falseInstruction}</div>
        </div>
        <div className={s.stimuliWrapper}>
           <img className={s.stimuli} src={stimuliFolderImages+trialData.currHSI+"/"+trialData.currQuestion+"/"+trialData.data.image}/>
          <AOI topLeftX={500} topLeftY={500} width={100} height={100} visible={true} name="testAOI" ref="test" gazeDataCallback={this.props.gazeDataCallback}/>
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
        keyPressed: keyPressed,
        eventStart: this.timeSinceStart,
        image: "ImageName"
        //image: "this.props.stimuli"
    }

    this.props.keyResponseCallback(keyResponseAction);
  }

  nextState(){
    this.props.stateCallback("Blackscreen");
  }
}

export default StimuliComponent;
