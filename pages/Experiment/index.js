import React from 'react';
import Layout from '../../components/Layout';
import s from './index.css';

//The experiment components
import Instructions from './InstructionsComponent';
import BlackScreen from './BlackscreenComponent';
import Stimuli from './StimuliComponent';

//The gaze cursor
import GazeCursor from './GazeCursor';

//The global store
import store from '../../core/store';

import testData from '../../ExperimentDataExample.json';

//The root folder that contains all the stimuli images and data
const stimuliFolder = './public/experiment/stimuli/'; //For the webserver

import hsiOrderJson from '../../public/experiment/hsiOrder.json';

class Experiment extends React.Component {
  constructor() {
    super();

    //Set the initial state of the component
    this.state = {
      type: "Instructions",
      taskCounter: -1
    };

    //Bind all the callback functions with the context of this
    this.handleStateUpdate = this.changeState.bind(this);
    this.handleKeyResponse = this.onKeyResponse.bind(this);
    this.handleGazeData = this.onGazeData.bind(this);
    this.handleRecievedData = this.onRecievedStimuliData.bind(this);

    //The keys that will be used during the experiments
    this.instructionsKey = "enter";
    this.trueKey = "z";
    this.falseKey = "/";
    this.alarmKey = "space";

    //The id of the current participant
    this.participantId = store.getState().participantId;

    //The variables used to control the flow of the experiment.
    this.hsiIndex = 0; //The index of the HSI to load from the hsiOrder
    this.questionIndex = 0; //e.g. The index of the current question
    this.trialIndex = 0; //The index of the current trial

    /*
    The loaded 2D array of hsi orders. Use the participant id % hsiOrder.length
    to get the outer index, then use the currHSI to get the inner index
      e.g. hsiOrder[participantId%hsiOrder.length][currHSI]
    */
    this.hsiOrder = hsiOrderJson.hsiOrder;

    //TODO make the data structure we discussed to hold the participant data. e.g. put the gazepath and keyresponses in this hsiData array. ["HSI1" ["Question1" ["Trial1"{gazePath, keyResponses}]]]
    this.gazePath = [];
    this.keyResponses = [];
    this.experimentData = {
      participantId: this.participantId,
      hsiOrder: this.hsiOrder[this.participantId%this.hsiOrder.length],
      hsiData: []
    };

    //Holds all the data required to run the experiment
    this.hsiData = null;

    //Holds the data for the current trial
    this.trialIndexData = null;
  }

  changeState(newState){
    switch(newState){
      case "Stimuli" : {
        this.setState({
          type: newState,
          taskCounter: this.state.taskCounter++
        });
        break;
      }
      case "default" : {
        this.setState({
          type: newState
        });
        break;
      }
    }

    this.setState({
      type: newState
    });
  }

  componentWillMount() {
    this.readStimuliDir(stimuliFolder, this.handleRecievedData);
  }

  loadTrialData(){
    let currHSI = this.hsiOrder[this.participantId%this.hsiOrder.length][this.hsiIndex];
    let currHSIData = null;

    for(var i = 0; i < this.hsiData.length; i++){
      if(currHSI === this.hsiData[i].hsi){
        currHSIData = this.hsiData[i];
      }
    }


    let currTrial = currHSIData.questions[this.questionIndex].trials[this.trialIndex];

    let result = {
      currHSI: currHSI,
      currQuestion: currHSIData.questions[this.questionIndex].question,
      data: currTrial
    }

    return result;
  }

  onRecievedStimuliData(data){
    console.log(data);
    this.hsiData = data;
  }



  render() {
    var componentToRender;

    switch(this.state.type){
      case "Instructions" : {
        componentToRender = <Instructions stateCallback={this.handleStateUpdate} nextKey={this.instructionsKey}
          instructions='Please determine if "Valve 1" is opened or closed'/>;
        break;
      }
      case "Blackscreen" : {
        componentToRender = <BlackScreen stateCallback={this.handleStateUpdate}/>;
        break;
      }
      case "Stimuli" : {
        let trialData = this.loadTrialData();

        componentToRender = <Stimuli stateCallback={this.handleStateUpdate} trueKey={this.trueKey} falseKey={this.falseKey} alarmKey={this.alarmKey}
          keyResponseCallback={this.handleKeyResponse} gazeDataCallback={this.handleGazeData}
          trialData={trialData}/>;
        break;
      }
      case "default" : {
        componentToRender = null;
        break;
      }
    }

    return (
      <Layout>
        <GazeCursor />
        <div className={s.container} onClick={this.testSaveData}>{componentToRender}</div>
      </Layout>
    );
  }

  onGazeData(gazeData){
    if(this.gazePath.length > 0){
      let prevAction = this.gazePath[this.gazePath.length-1];
      if(prevAction.category === "Fixation" && gazeData.category=== "Fixation"){
        let saccade = {
            category: "Saccade",
            eventStart: prevAction.eventEnd,
            eventEnd: gazeData.eventStart,
            eventDuration: gazeData.eventStart-prevAction.eventEnd,
            fixationPos: {
              posX: "-",
              posY: "-"
            },
            aoiName: "-",
            image: "-",
            participantId: this.participantId
        }
        this.gazePath.push(saccade);
      }
    }

    gazeData.participantId = this.participantId;
    this.gazePath.push(gazeData);
  }

  onKeyResponse(keyResponse){
    keyResponse.participantId = this.participantId;
    this.keyResponses.push(keyResponse);
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
          request: 'read stimuli data',
          fileName: filename
      })
    });
    fetch(request).then(function(response) {
      return response.json();
    }).then(function(j) {
      callback(j);
    });
  }
}

export default Experiment;
