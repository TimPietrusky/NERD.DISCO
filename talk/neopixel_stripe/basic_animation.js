// Import the neopixels library
var Neopixels = require('neopixels');

// Make an instance of the strip
var neopixels = new Neopixels();

// Amount of LEDs
var numLEDs = 14 * 10;

// Length of the tail in frames
var tail = 0;

// Frames per second
var fps = Math.round(1000 / 40); //1000 / 24;



function randomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function fillLed(buffer, position, color) {
  buffer[(position * 3)] = color[0];
  buffer[(position * 3) + 1] = color[1];
  buffer[(position * 3) + 2] = color[2];

  return buffer;
}

var buffer = new Buffer(numLEDs * 3);
var animation_position = 0;
var counter = 0;
var currentColor = red;


function start() {

  if (counter++ >= tail) {
    // Reset every value
    buffer.fill(0x00);
    counter = 0;
  } else {
    fillLed(buffer, animation_position - tail + 1, [0, 0, 0]);
  }

  if (animation_position++ >= numLEDs) {
    animation_position = 0;
    counter = tail + 1;
  }

  currentColor = [randomValue(0, 200), randomValue(0, 200), randomValue(0, 200)];

  buffer = fillLed(buffer, animation_position, currentColor);
  neopixels.animate(numLEDs, buffer);

  setTimeout(start, 75);
}

start();