var ws = require("nodejs-websocket");
var port = 1337;

var msg;

// Create the websocket server, provide connection callback
var server = ws.createServer(function (conn) {
  console.log("New connection");


  // If we get text from the client, and echo it  
  conn.on("text", function (str) {
    // Parse incoming message
    msg = JSON.parse(str);

    server.connections.forEach(function (conn) {

      if (conn.path !== '/?visualizer') {

        var data = {
          volume : Math.round(msg.text)
        };

        conn.sendText(JSON.stringify(data));
      }
    });
  });





  // When the client closes the connection, notify us
  conn.on("close", function (code, reason) {
      console.log("Connection closed");
  });

  conn.on("error", function (error) {
      console.log("Error", error);
  });
}).listen(port);

console.log('listening on port', port);