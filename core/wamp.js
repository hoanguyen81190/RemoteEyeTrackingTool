var autobahn = require('autobahn');

var connection = new autobahn.Connection({
   url: 'ws://127.0.0.1:8080/ws',
   realm: 'realm1'
 }
);

var session;
connection.onopen = function (sess, details) {
  session = sess;
  console.log("Connected");
}

// fired when connection was lost (or could not be established)
//
connection.onclose = function (reason, details) {
}


// now actually open the connection
//
connection.open();
