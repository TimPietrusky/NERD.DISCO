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









  var audiolist = document.querySelector('[data-js="audiolist"]');
  var started = false;
  var loaded = [];

  audiolist.addEventListener('click', function(event) {
    var _target = event.target,
        _url = _target.getAttribute('data-url')
    ;

    if (!started && loaded.indexOf(_url) == -1) {
      setupAudioNodes();
      loadSound(_url);
      started = true;
      loaded = [];
      loaded.push(_url);
    } else if (started) {
      started = false;
      pauseSound();
    } else {
      started = true;
      resumeSound();
    }

  });








// check if the default naming is enabled, if not use the chrome one.
if (! window.AudioContext) {
    if (! window.webkitAudioContext) {
        alert('no audiocontext found');
    }
    window.AudioContext = window.webkitAudioContext;
}


var context = new AudioContext();
var audioBuffer;
var sourceNode;
var splitter;
var analyser, analyser2;
var javascriptNode;

// load the sound
// setupAudioNodes();
// loadSound("audio/Narrow_Road-Overtaken.mp3");

function setupAudioNodes() {

    // setup a javascript node
    javascriptNode = context.createScriptProcessor(512, 1, 1);
    // connect to destination, else it isn't called
    javascriptNode.connect(context.destination);

    // setup a analyzer
    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 2048;

    analyser2 = context.createAnalyser();
    analyser2.smoothingTimeConstant = 0.0;
    analyser2.fftSize = 2048;

    // create a buffer source node
    sourceNode = context.createBufferSource();
    splitter = context.createChannelSplitter();

    // connect the source to the analyser and the splitter
    sourceNode.connect(splitter);

    // connect one of the outputs from the splitter to
    // the analyser
    splitter.connect(analyser,0,0);
    splitter.connect(analyser2,1,0);

    // we use the javascript node to draw at a
    // specific interval.
    analyser.connect(javascriptNode);

    // and connect to destination
    sourceNode.connect(context.destination);

    // Listen for "audioprocess" event
    javascriptNode.addEventListener('audioprocess', function() {
      // get the average for the first channel
      var array =  new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      // console.log(array);
      window.average = getAverageVolume(array);

      // get the average for the second channel
      var array2 =  new Uint8Array(analyser2.frequencyBinCount);
      analyser2.getByteFrequencyData(array2);
      window.average2 = getAverageVolume(array2);


      // Ugly :D
      var frequency = document.querySelector('[data-js="frequency"]');
      var average_normalized = Math.round(window.average);

      frequency.innerHTML = average_normalized;
    }.bind(this));
}

// load the specified sound
function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // When loaded decode the data
    request.onload = function() {

        // decode the data
        context.decodeAudioData(request.response, function(buffer) {
            // when the audio is decoded play the sound
            playSound(buffer);
        }, onError);

    };

    request.send();
}


function playSound(buffer) {
    sourceNode.buffer = buffer;
    sourceNode.start(0);
}

function stopSound() {
    sourceNode.stop();
}

// log if an error occurs
function onError(e) {
    console.log(e);
}

function pauseSound() {
    sourceNode.disconnect();
}

function resumeSound() {
    // connect the source to the analyser and the splitter
    sourceNode.connect(splitter);

    // connect one of the outputs from the splitter to
    // the analyser
    splitter.connect(analyser,0,0);
    splitter.connect(analyser2,1,0);

    // we use the javascript node to draw at a
    // specific interval.
    analyser.connect(javascriptNode);
    sourceNode.connect(context.destination);
}


function getAverageVolume(array) {
    var values = 0;
    var average;

    var length = array.length;

    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
        values += array[i];
    }

    average = values / length;
    return average;
}

});