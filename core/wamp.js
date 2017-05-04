import store from './store';

var autobahn = require('./autobahn.min.js');

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
    let gazeAction = {
      type: 'SET_GAZE_DATA',
      gazeData: {
        locX: ((gazeData[1] + gazeData[4])/2),
        locY: ((gazeData[2] + gazeData[5])/2)
      }
    }
    store.dispatch(gazeAction);
  }

  function onCounter(args) {
    console.log(args);
  }

  session.subscribe('RETDataSample', onRETData);
  session.subscribe('oncounter', onCounter);
}

// fired when connection was lost (or could not be established)
//
connection.onclose = function (reason, details) {
  console.log("Disconnected from WAMP router");
}


// now actually open the connection
//
connection.open();
