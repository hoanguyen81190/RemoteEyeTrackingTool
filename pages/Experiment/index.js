import React from 'react';
import Layout from '../../components/Layout';
import s from './index.css';

//The experiment components
import Instructions from './InstructionsComponent';
import BlackScreen from './BlackscreenComponent';
import Stimuli from './StimuliComponent';

//The gaze cursor
import GazeCursor from './GazeCursor';

import store from '../../core/store';

//The root folder that contains all the stimuli images and data
const stimuliFolder = '../../resources/experiment/stimuli/';

import hsiOrderJson from '../../resources/experiment/hsiOrder.json';

//Reads all the files in the provided directory, callback for file content and for error handling
function readFiles(dirname){//, onFileContent, onError) {
  // fs.readdir(dirname, function(err, filenames) {
  //   if (err) {
  //     //onError(err);
  //     return;
  //   }

    //console.log("Reading " + dirname)

    // filenames.forEach(function(filename) {
    //   fs.readFile(dirname + filename, 'utf-8', function(err, content) {
    //     if (err) {
    //       //onError(err);
    //       return;
    //     }
    //
    //     console.log(filename);
    //     //onFileContent(filename, content);
    //   });
    // });
  //});
}

class Experiment extends React.Component {
  constructor() {
    super();

    this.handleStateUpdate = this.changeState.bind(this);
    this.handleKeyResponse = this.onKeyResponse.bind(this);
    this.handleGazeData = this.onGazeData.bind(this);

    this.state = {
      type: "Instructions",
      taskCounter: -1
    };

    this.instructionsKey = "enter";
    this.trueKey = "z";
    this.falseKey = "/";
    this.alarmKey = "space";


    this.gazePath = [];
    this.keyResponses = [];

    this.participantId = store.getState().participantId;
    this.hsiOrder = hsiOrderJson.hsiOrder; //The loaded 2D array of hsi orders. Use the participant id % hsiOrder.length to get the outer index, then use the currHSI to get the inner index
                                          //e.g. hsiOrder[participantId%hsiOrder.length][currHSI]
    this.currHSI = 0; //The index of the HSI to load from the hsiOrder

    this.experimentData = {
      participantId: this.participantId,
      hsiOrder: this.hsiOrder[this.participantId%this.hsiOrder.length],
      hsiData: []
    };

    this.questions = []; //The names of the question folders
    this.currQuestion = 0; //e.g. The index of the current question
    this.trials = []; //The loaded trials of the current question
    this.currTrial = 0; //The index of the current trial
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

  componentDidMount() {

  }

  componentWillMount() {

  }

  loadTrial(){
    let currHSI = this.hsiOrder[this.participantId%this.hsiOrder.length][this.currHSI];

    readFiles(stimuliFolder+currHSI);

  }

  render() {
    this.loadTrial();

    var componentToRender;

    switch(this.state.type){
      case "Instructions" : {
        componentToRender = <Instructions stateCallback={this.handleStateUpdate} nextKey={this.instructionsKey}
          instructions='Please determine if "Valve 1" is opened or closed'/>; //TODO pass keys down to these ones as props, pass callbacks for the gaze data and the key responses
        break;
      }
      case "Blackscreen" : {
        componentToRender = <BlackScreen stateCallback={this.handleStateUpdate}/>;
        break;
      }
      case "Stimuli" : {
        componentToRender = <Stimuli stateCallback={this.handleStateUpdate} trueKey={this.trueKey} falseKey={this.falseKey} alarmKey={this.alarmKey}
          keyResponseCallback={this.handleKeyResponse} gazeDataCallback={this.handleGazeData}
          instructions='Please determine if "Valve 1" is opened or closed'/>;
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
}

export default Experiment;
