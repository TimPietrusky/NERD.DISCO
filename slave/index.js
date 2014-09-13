var tessel = require('tessel'),
    Animation = require('./components/animation')
;

// var _neopixels = new Neopixels();

var _animation = new Animation();

// Receive message from Overlord
process.on('message', function(data) {

  if (!_animation.initialized) {
    _animation.init({
      amountLeds : data.leds.amount
    });

    _animation.kickDefault();

    process.send(data);
  }

  // Debugging
  if (data.leds.amount === (150)) {
    process.send(data);
  }

  _animation.setVolume(data.volume);
});

// Keep the event loop alive 
process.ref();