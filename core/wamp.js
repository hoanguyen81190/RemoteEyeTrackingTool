import store from './store';

var autobahn = require('./autobahn.min.js');

const EventEmitter = require('events');
class CFixationStore extends EventEmitter {
  addFixationListener(callback) {
    this.addListener('NEW FIXATION', callback);
  }
  removeFixationListener(callback) {
    this.removeListener('NEW FIXATION', callback);
  }
  addNewFixation() {
    this.emit('NEW FIXATION');
  }
}
let fixationStore = new CFixationStore();
export default fixationStore;

var connection = new autobahn.Connection({
   url: 'ws://127.0.0.1:8080/ws',
   realm: 'realm1'
 }
);

//RETDataSample
var session;
connection.onopen = function (sess, details) {
  session = sess;
  console.log("Connected to WAMP router");
  function onRETData(args) {
    let gazeRadius = store.getState().gazeCursorRadius;

    let gazeData = args[1];
    let gazeX = 0;
    let gazeY = 0;

    //Both eyes valid
    if(!(gazeData[0] < Number.EPSILON) && !(gazeData[3] < Number.EPSILON)){
      gazeX = (gazeData[1] + gazeData[4])/2;
      gazeY = (gazeData[2] + gazeData[5])/2;
    }
    //Left eye validity
    else if(!(gazeData[0] < Number.EPSILON)){
      gazeX = gazeData[1];
      gazeY = gazeData[2];
    }
    //Right eye validity
    else if(!(gazeData[3] < Number.EPSILON)){
      gazeX = gazeData[4];
      gazeY = gazeData[5];
    }
    else{
      return;
    }

    let gazeAction = {
      type: 'SET_GAZE_DATA',
      gazeData: {
        locX: gazeX,
        locY: gazeY
      }
    }
    store.dispatch(gazeAction);
  }

  function onRETDataFixations(args) {
    let fixationAction = {
      type: 'SET_FIXATION_DATA',
      fixation: {
        locX: args[1],
        locY: args[2],
        timestamp: args[3],
        duration: args[4]
      }
    }
    store.dispatch(fixationAction);
    fixationStore.addNewFixation();
  }

  function onRetCalibrationResult(args) {
    let calResultAction = {
      type: 'SET_CALIBRATION_RESULT',
      calResult: {
        calX: args[1],
        calY: args[2],
      }
    }
    store.dispatch(calResultAction);
  }

  session.subscribe('RETDataSample', onRETData);
  session.subscribe('RETDataFixations', onRETDataFixations);
  session.subscribe('RETCalibrationResult', onRetCalibrationResult);
}

// fired when connection was lost (or could not be established)
//
connection.onclose = function (reason, details) {
  console.log("Disconnected from WAMP router");
}


// now actually open the connection
//
connection.open();
