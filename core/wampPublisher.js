var autobahn = require('./autobahn.min.js');

var connection = new autobahn.Connection({
   url: 'ws://127.0.0.1:8080/ws',
   realm: 'realm1'
 }
);



export function publishEvent(topic, data) {
  if(connection.isConnected){
    connection.close();
  }

  // fired when connection was lost (or could not be established)
  connection.onclose = function (reason, details) {

  }

  connection.onopen = function (sess, details) {
    var session = sess;
    session.publish(topic, data);
    console.log("Published to topic", topic, data);
    connection.close();
  }

  // now actually open the connection
  connection.open();
}
