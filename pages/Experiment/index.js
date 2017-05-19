import React from 'react';
import Layout from '../../components/Layout';
import s from './index.css';

//The experiment components
import Instructions from './InstructionsComponent';
import BlackScreen from './BlackscreenComponent';
import Stimuli from './StimuliComponent';
import PracticeComponent from './PracticeComponent';
import DataInput from './DataInputComponent';

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
      type: "DataInput",
      hsiData: null
    };

    this.experimentFinished = false;
    this.dataRecieved = false;

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
    this.nmbHSI = null; //The number of HSIs
    this.questionIndex = 0; //e.g. The index of the current question
    this.nmbQuestions = null; //The number of questions in the HSI
    this.trialIndex = 0; //The index of the current trial
    this.nmbTrials = null; //The number of trials in the current question

    /*
    The loaded 2D array of hsi orders. Use the participant id % hsiOrder.length
    to get the outer index, then use the currHSI to get the inner index
      e.g. hsiOrder[participantId%hsiOrder.length][currHSI]
    */
    this.hsiOrder = hsiOrderJson.hsiOrder;

    this.gazePath = [];
    this.keyResponses = [];
    this.experimentData = {
      participantId: this.participantId,
      hsiOrder: this.hsiOrder[this.participantId%this.hsiOrder.length],
      hsiData: []
    };

    //Holds the data for the current trial
    this.trialIndexData = null;

    this.previousFixationIndex = null;
  }

  initDataStructure(){
    this.participantId = store.getState().participantId;

    this.experimentData = {
      participantId: this.participantId,
      hsiOrder: this.hsiOrder[this.participantId%this.hsiOrder.length],
      hsiData: []
    };

    let currHSI = this.hsiOrder[this.participantId%this.hsiOrder.length][this.hsiIndex];
    this.experimentData.hsiData.push({
      hsi: currHSI,
      questions: []
    })

    let currHSIData = null;

    for(var i = 0; i < this.state.hsiData.length; i++){
      if(currHSI === this.state.hsiData[i].hsi){
        currHSIData = this.state.hsiData[i];
      }
    }

    let currQuestion = currHSIData.questions[this.questionIndex].question;
    this.experimentData.hsiData[0].questions.push({
      question: currQuestion,
      trials: []
    })
  }

  changeState(newState){
    if(this.state.type==="DataInput"){
      this.initDataStructure();
    }

    switch(newState){
      case "Stimuli" : {
        this.setState({
          type: newState,
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

    for(var i = 0; i < this.state.hsiData.length; i++){
      if(currHSI === this.state.hsiData[i].hsi){
        currHSIData = this.state.hsiData[i];
      }
    }

    this.nmbHSI = this.state.hsiData.length;
    this.nmbQuestions = currHSIData.questions.length;
    this.nmbTrials = currHSIData.questions[this.questionIndex].trials.length;

    let currTrial = currHSIData.questions[this.questionIndex].trials[this.trialIndex];

    let result = {
      currHSI: currHSI,
      currBlockInstructions: currHSIData.questions[this.questionIndex].blockInstructions,
      currQuestion: currHSIData.questions[this.questionIndex].question,
      data: currTrial
    }

    return result;
  }

  onRecievedStimuliData(data){
    this.dataRecieved = true;
    this.setState({
      hsiData: data
    })
  }

  render() {
    var componentToRender;
    if(!this.dataRecieved){
      return null;
    }

    switch(this.state.type){
      case "DataInput": {
        componentToRender = <DataInput stateCallback={this.handleStateUpdate} callbackState="HSIScreen"/>;
        break;
      }
      case "BlockInstructions" : {
          var trialData = this.loadTrialData();
          componentToRender = <Instructions stateCallback={this.handleStateUpdate} callbackState="PracticeSession"
          nextKey={this.instructionsKey} instructions={trialData.currBlockInstructions}/>;
        break;
      }
      case "BreakScreen" : {
          componentToRender = <Instructions stateCallback={this.handleStateUpdate} callbackState="HSIScreen" calibration={true}
          nextKey={this.instructionsKey} instructions="HSI completed - Press Enter to continue to the next HSI when ready"/>;
        break;
      }
      case "HSIScreen" : {
          let currHSI = this.hsiOrder[this.participantId%this.hsiOrder.length][this.hsiIndex];
          var trialData = this.loadTrialData();
          componentToRender = <Instructions stateCallback={this.handleStateUpdate} callbackState="BlockInstructions" calibration={true}
          nextKey={this.instructionsKey} instructions={currHSI + " is beginning - Press Enter to begin"}/>;
        break;
      }
      case "FinishedScreen" : {
          componentToRender = <Instructions stateCallback={this.handleStateUpdate} finished={true}
          instructions={"The experiment is completed"}/>;
        break;
      }
      case "PracticeSession" : {
        var trialData = this.loadTrialData();
        componentToRender = <PracticeComponent stateCallback={this.handleStateUpdate} callbackState="TrialInstructions"
          responseKeys={trialData.data.responseKeys}/>;
        break;
      }
      case "TrialInstructions" : {
          var trialData = this.loadTrialData();
        componentToRender = <Instructions stateCallback={this.handleStateUpdate} callbackState="Blackscreen"
        nextKey={this.instructionsKey} instructions={trialData.data.question}/>;
        break;
      }
      case "Blackscreen" : {
        componentToRender = <BlackScreen stateCallback={this.handleStateUpdate}/>;
        break;
      }
      case "Stimuli" : {
          var trialData = this.loadTrialData();
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
        <div className={s.container}>{componentToRender}</div>
      </Layout>
    );
  }

  onGazeData(gazeData){
    if(this.gazePath.length > 0){
      let prevAction = this.gazePath[this.previousFixationIndex];
      if(prevAction.category === "Fixation" && gazeData.category === "Fixation"){
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
    this.previousFixationIndex = this.gazePath.length-1;
  }

  onKeyResponse(keyResponse, correctAnswer){
    keyResponse.participantId = this.participantId;
    this.keyResponses.push(keyResponse);

    this.prepareNextStep(correctAnswer);
  }

  prepareNextStep(correctAnswer){
    if(this.experimentFinished){
      return;
    }
    console.log(this.experimentData);
    this.experimentData.hsiData[this.hsiIndex].questions[this.questionIndex].trials.push({
      trial: this.trialIndex,
      keyResponse: this.keyResponses,
      correctAnswer: correctAnswer,
      gazePath: this.gazePath
    });

    this.gazePath = [];
    this.keyResponses = [];

    //Increment the trialIndex and check if we need to move to the next question block
    this.trialIndex++;
    if(this.trialIndex === this.nmbTrials){
      this.trialIndex = 0;

      //Increment the questionIndex and check if we need to move to the next hsi
      this.questionIndex++;
      if(this.questionIndex === this.nmbQuestions){
        this.questionIndex = 0;

        //Increment the hsiIndex and check if the experiment is finished
        this.hsiIndex++;
        if(this.hsiIndex === this.nmbHSI){
          //TODO end experiment here
          this.experimentFinished = true;
          console.log(this.experimentData);
          this.saveDataToExcelFiles(this.experimentData);
          this.changeState("FinishedScreen");
        }
        //Otherwise we move on to the next hsi
        else{
          let currHSI = this.hsiOrder[this.participantId%this.hsiOrder.length][this.hsiIndex];
          this.experimentData.hsiData.push({
            hsi: currHSI,
            questions: []
          })

          let currHSIData = null;
          for(var i = 0; i < this.state.hsiData.length; i++){
            if(currHSI === this.state.hsiData[i].hsi){
              currHSIData = this.state.hsiData[i];
            }
          }

          let currQuestion = currHSIData.questions[this.questionIndex].question;
          this.experimentData.hsiData[this.hsiIndex].questions.push({
            question: currQuestion,
            trials: []
          })
          this.changeState("BreakScreen");
        }
      }
      //Otherwise we move to the block information screen
      else{
        let currHSIData = null;
        let currHSI = this.hsiOrder[this.participantId%this.hsiOrder.length][this.hsiIndex];

        for(var i = 0; i < this.state.hsiData.length; i++){
          if(currHSI === this.state.hsiData[i].hsi){
            currHSIData = this.state.hsiData[i];
          }
        }

        let currQuestion = currHSIData.questions[this.questionIndex].question;
        this.experimentData.hsiData[this.hsiIndex].questions.push({
          question: currQuestion,
          trials: []
        })
        //TODO add the block instruction screen
        this.changeState("BlockInstructions");
      }
    }
    //Otherwise we go back to the instruction screen
    else{
      this.changeState("TrialInstructions");
    }
  }

  saveDataToExcelFiles(excelData) {
    console.log("save", excelData);
    var fileName = 'ExperimentData.xlsx';
    var request = new Request('http://localhost:3000/api', {
       method: 'POST',
       headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
       },
       redirect: 'follow',
       body: JSON.stringify({
          request: 'save data',
          path: './public/experiment/data',
          fileName: fileName,
          data: JSON.stringify(excelData)
      })
      // mode: 'no-cors'
    });
      fetch(request).then(function(response) {
        return response.json();
      }).then(function(j) {
        alert('Data Saved!');
        console.log(j);
      });
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
