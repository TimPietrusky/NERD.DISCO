window.addEventListener("load", function () {

  var url = "ws://localhost:1337?visualizer";

  connection = new WebSocket(url);

  connection.onopen = function () {
    console.log("Connection opened");

    setInterval(function() {

      if (connection.readyState !== WebSocket.OPEN) {
        connection = new WebSocket(url);
      } else {

        var msg = {
          type: "visualizer",
          text: window.average
        };

        // Send the msg object as a JSON-formatted string.
        connection.send(JSON.stringify(msg));
      }

    }, 30);

  };

  connection.onclose = function () {
    console.log("Connection closed");
  };

  connection.onerror = function () {
    console.error("Connection error");
  };

  connection.onmessage = function (event) {
    var div = document.createElement("div");
    div.textContent = event.data;
    document.body.appendChild(div);
  };

});