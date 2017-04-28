var autobahn = require('autobahn');

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
    console.log("Data recieved");
  }

  session.subscribe('RETDataSample', onRETData);
}

// fired when connection was lost (or could not be established)
//
connection.onclose = function (reason, details) {
  console.log("Disconnected from WAMP router");
}


// now actually open the connection
//
connection.open();
