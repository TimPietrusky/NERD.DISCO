// Import the Tessel module
var tessel = require('tessel');

// Get useful names for every LED
var led = {
  blue   : tessel.led[1],
  green  : tessel.led[0],
  amber  : tessel.led[3],
  red    : tessel.led[2]
};

// Create an array of LEDs that should blink
var blink_leds = [
  { color : led.blue,  state : 0, delay : 1 },
  { color : led.green, state : 0, delay : 1.125 },
  { color : led.amber, state : 0, delay : 1.25 },
  { color : led.red,   state : 0, delay : 1.375 }
];

// The total duration of one blink
var blink_duration = 250;


// Iterate over "blink_leds"
for (var i = 0; i < blink_leds.length; i++) {
  // Get a single LED
  var _led = blink_leds[i];

  // Amount of blink iterations
  _led.iterations = 0;

  // Start the blinking after some delay
  setTimeout(blink, blink_duration * _led.delay, _led);
}



// Creates a setTimeout for the given led, so that it blinks forever.
function blink (led) {
  // Turn the LED off or on
  led.color.write(led.state);

  // Toggle the state
  led.state = !led.state;

  // Increase iterations
  led.iterations++;

  // Every third iteration
  if (led.iterations % 3 === 0) {
    // Reset iterations
    led.iterations = 0;

    // Toggle the state
    led.state = !led.state;
  }

  setTimeout(blink, blink_duration, led);

}