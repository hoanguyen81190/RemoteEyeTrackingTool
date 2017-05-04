import React, { PropTypes } from 'react';
import s from './StimuliComponent.css';

import store from '../../core/store';

import wamp from '../../core/wamp';

import AOI from './AOIComponent';

import aois from '../../resources/experiment/aois.json';
import testImage from '../../resources/images/test.png';

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
    key(this.props.trueKey, 'stimuli', this.handleTruePressed);
    key(this.props.falseKey, 'stimuli', this.handleFalsePressed);
    key(this.props.alarmKey, 'stimuli', this.handleAlarmPressed);

    //Timer to update all the AOIs in this stimuli component
    this.timer = setInterval(this.handleAOIUpdate, this.timerInterval);

    let img = this.refs["imageRef"];
    let imgContainer = this.refs["imgContainerRef"];
    if(img && imgContainer) {
      let w = img.clientWidth/imgContainer.clientWidth;
      let h = img.clientHeight/imgContainer.clientHeight;
      this.aoiRefs.map((item, index) => {
        var aoi = this.refs[item];
        if(aoi) {
          aoi.setRatios(w, h);
        }
      });
    }
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
    return (
      <div className={s.container}>
        <div className={s.instructionsWrapper}>{this.props.instructions}</div>
        <div className={s.stimuliWrapper} ref="imgContainerRef">
          <img className={s.stimuli} src={testImage} ref="imgRef"/>
          {
            aois.AOIs.map((item, index) => {
              var ref = "AOIref" + index;
              this.aoiRefs.push(ref);
              return (<AOI topLeftX={item.left} topLeftY={item.top} width={item.width} height={item.height} visible={true} name={item.name} ref={ref} gazeDataCallback={this.props.gazeDataCallback}/>);
            })
          }
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

export default Instructions;
