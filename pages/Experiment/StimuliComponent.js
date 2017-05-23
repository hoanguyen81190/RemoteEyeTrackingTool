import React, { PropTypes } from 'react';
import s from './StimuliComponent.css';

import store from '../../core/store';

import wamp from '../../core/wamp';
import fixationStore from '../../core/wamp';

import AOI from './AOIComponent';
import Fixation from './Fixation';

// import aois from '../../public/experiment/aois.json';
const aoisPath = './public/experiment/aois.json'; //For the webserver
var key = require('keymaster');

const stimuliFolderImages = 'experiment/stimuli/'; //To read the images

class StimuliComponent extends React.Component {
  constructor(props){
    super(props);
    this.handleTruePressed = this.truePressed.bind(this);
    this.handleFalsePressed = this.falsePressed.bind(this);
    this.handleAlarmPressed = this.alarmPressed.bind(this);

    this.handleAOIUpdate = this.updateAOIs.bind(this);
    this.handleRecievedData = this.onRecievedStimuliData.bind(this);

    this.aoiRefs = [];
    this.timerInterval = 4.5;

    this.firstRender = true;

    this.timeSinceStart = 0;

    this.closestAOI = null;
    this.keyPressed = false;
    this.firstUpdate = true;
    this.state = {
      aois: null
    }
    this.dataRecieved = false;
    this.handleNewFixation = this._onNewFixation.bind(this);
    this.startTime = 0;
    this.currentFixation = 0;
    this.fixations = [];
  }

  componentWillMount() {
    this.readStimuliDir(aoisPath, this.handleRecievedData);
  }

  componentDidMount() {
    this.firstUpdate = true;
    let timestampAction = {
      type: 'SET_TRIAL_START_TS',
      timestamp: Date.now()
    }
    store.dispatch(timestampAction);
    this.startTime = performance.now();

    key.setScope('stimuli');
    key(this.props.trueKey, 'stimuli', this.handleTruePressed);
    key(this.props.falseKey, 'stimuli', this.handleFalsePressed);
    key(this.props.alarmKey, 'stimuli', this.handleAlarmPressed);

    //Timer to update all the AOIs in this stimuli component
    this.timer = setInterval(this.handleAOIUpdate, this.timerInterval);

    this.updateRatios();
    window.addEventListener("resize", this.updateRatios.bind(this));
    fixationStore.addFixationListener(this.handleNewFixation);
  }

  _onNewFixation() {
    // if(!firstUpdate) {
      let newFixation = store.getState().fixation;
      let eventEnd = Date.now() - store.getState().trialStartTimestamp;
      if(eventEnd - newFixation.duration < 0) {
        return;
      }
      if(this.fixations.length >= 10) {
        this.fixations.shift();
      }
      this.fixations.push(newFixation);
      this.fixations.map((f, f_i) => {
        let fixationComponent = this.refs["fixationDiv"+f_i];
        if(fixationComponent) {
          fixationComponent.updateData(f);
        }
      });

      if(this.aoiRefs.length > 0){
        var closestAOI = null;
        var closestResult = null;
        this.aoiRefs.map((aoiRef, index) => {
          var aoi = this.refs[aoiRef];
          if(aoi) {

            let result = aoi.isInside({locX: newFixation.locX, locY: newFixation.locY});
            if(result.inside) {
              if(!closestAOI || result.distance < closestResult.distance){
                closestAOI = aoi;
                closestResult = result;
              }

              //Mark active aois as inactive if the cursor is not inside, or if the key was pressed
              if(!result.inside && aoi.isActive() || this.keyPressed && aoi.isActive()){
                // aoi.onExit();
              }
            }
          }
        });

        let fixationLocX = parseFloat(newFixation.locX.toFixed(1));
        let fixationLocY = parseFloat(newFixation.locY.toFixed(1));
        let name = 'unspecified AOI';
        if(closestAOI) {
          name = closestAOI.getName();
        }
        let gazePathAction =
        {
          category: "Fixation",
          eventStart: eventEnd - newFixation.duration,
          eventEnd: eventEnd,
          eventDuration: newFixation.duration,
          fixationPos: {
            posX: fixationLocX,
            posY: fixationLocY
          },
          aoiName: name,
          image: "-"
        }
        this.props.gazeDataCallback(gazePathAction);
      }
    // }
  }

  readStimuliDir(filename, callback) {
    var request = new Request('http://localhost:3000/api', {
       method: 'POST',
       headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       },
       redirect: 'follow',
       body: JSON.stringify({
          request: 'read aois',
          fileName: filename
      })
    });
    fetch(request).then(function(response) {
      return response.json();
    }).then(function(j) {
      callback(j);
    });
  }

  componentDidUpdate() {
    if(this.aoiRefs.length > 0 && this.dataRecieved) {
      this.updateRatios();
      this.dataRecieved = false;
    }
  }

  onRecievedStimuliData(data){
    this.dataRecieved = true;
    this.setState({
      aois: JSON.parse(data)
    })
  }

  updateRatios() {
    let img = this.refs["imageRef"];
    let imgContainer = this.refs["imgContainerRef"];
    let imgWrapper = this.refs["imgWrapperRef"];
    if(img && imgContainer && imgWrapper) {
      let w = img.clientWidth/imgContainer.clientWidth;
      let h = img.clientHeight/imgContainer.clientHeight;

      this.aoiRefs.map((item, index) => {
        var aoi = this.refs[item];
        if(aoi) {
          aoi.setContainerSizeBox(w, h, imgContainer.clientWidth, imgContainer.clientHeight, imgWrapper.offsetTop, imgWrapper.offsetLeft);
        }
      });
    }
  }

  componentWillUnmount(){
    key.deleteScope('stimuli');
    clearInterval(this.timer);
    window.removeEventListener("resize", this.updateRatios.bind(this));
    fixationStore.removeFixationListener(this.handleNewFixation);
  }

 render() {

    if(this.firstRender){
      this.firstRender = false;

      console.log(this.props.trialData);

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
          image: this.props.trialData.data.image
      }

      this.props.gazeDataCallback(gazePathAction)
    }

    this.aoiRefs = [];

    let trialData = this.props.trialData;

    let trueInstruction = "Press " + trialData.data.responseKeys[0].key + ' for "'  + trialData.data.responseKeys[0].meaning + '"';
    let falseInstruction = "Press " + trialData.data.responseKeys[1].key + ' for "'  + trialData.data.responseKeys[1].meaning + '"';
    var aois = this.state.aois ? <div>{this.state.aois.AOIs.map((item, index) => {
      var ref = "AOIref" + index;
      this.aoiRefs.push(ref);
      return (<AOI key={index} topLeftX={item.left} topLeftY={item.top} width={item.width} height={item.height} visible={true} name={item.name} ref={ref} gazeDataCallback={this.props.gazeDataCallback}/>);
    })}</div> : null;
    return (
      <div className={s.container} ref="imgContainerRef">
        <div className={s.instructionsWrapper}>
          <div className={s.instructions}>{trialData.data.question}</div>
          <div className={s.trueText}>{trueInstruction}</div>
          <div className={s.falseText}>{falseInstruction}</div>
        </div>
        <div className={s.stimuliWrapper} ref="imgWrapperRef">
           <img className={s.stimuli} src={stimuliFolderImages+trialData.currHSI+"/"+trialData.currQuestion+"/"+trialData.data.image} ref="imageRef"/>

        </div>
        {
          aois
        }
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i, index)=>{return <Fixation key={index} ref={"fixationDiv" + index} index={index}/>})
        }
      </div>
    );
  }

  updateAOIs(){
    // if(this.firstUpdate){
    //   let timestampAction = {
    //     type: 'SET_TRIAL_START_TS',
    //     timestamp: Date.now()
    //   }
    //   store.dispatch(timestampAction);
    //
    //   this.firstUpdate = false;
    // }
    //
    this.timeSinceStart += this.timerInterval;
    if(this.aoiRefs.length > 0){
      var closestAOI = null;
      var closestResult = null;
      this.aoiRefs.map((aoiRef, index) => {
        var aoi = this.refs[aoiRef];
        if(aoi) {

          let result = aoi.onTick(this.timerInterval);

          if(!closestAOI || result.distance < closestResult.distance){
            closestAOI = aoi;
            closestResult = result;
          }

          //Mark active aois as inactive if the cursor is not inside, or if the key was pressed
          if(!result.inside && aoi.isActive() || this.keyPressed && aoi.isActive()){
            aoi.onExit();
          }
        }
      });

      //If the previous closest AOI was active mark it as inactive
      if(this.closestAOI && this.closestAOI !== closestAOI && this.closestAOI.isActive()){
        this.closestAOI.onExit();
      }

      if(closestAOI){
        //If the AOI is not marked as looked at and the cursor is inside we call the on enter function
        if(closestResult.inside && !closestAOI.isActive()){
          closestAOI.onEnter();
          this.closestAOI = closestAOI;
        }
      }
    }
  }

  alarmPressed(){
    console.log("Alarm pressed");

    this.dispatchKeyResponse(this.props.alarmKey);

    return false; //Prevents bubbling of the event
  }

  truePressed(){
    console.log("True pressed");

    this.dispatchKeyResponse(this.props.trueKey);

    return false; //Prevents bubbling of the event
  }

  falsePressed(){
    console.log("False pressed");

    this.dispatchKeyResponse(this.props.falseKey);

    return false; //Prevents bubbling of the event
  }

  dispatchKeyResponse(keyPressed){
    this.addLastFixation();

    let keyResponseAction = {
        keyPressed: keyPressed,
        eventStart: Date.now() - store.getState().trialStartTimestamp,
        image: this.props.trialData.data.image
    }
    var correctAnswer = this.props.trialData.data.correctAnswer;
    this.props.keyResponseCallback(keyResponseAction, this.props.trialData.data.responseKeys[correctAnswer].key);
  }

  //Called when a key was pressed to end the current trial. If the participant is looking at an AOI at this time we want to add that fixation data to the gaze path
  addLastFixation(){
    this.keyPressed = true;
    this.updateAOIs();
    this.keyPressed = false;
  }

  nextState(){
    this.props.stateCallback("TrialInstructions");
  }
}

export default StimuliComponent;
