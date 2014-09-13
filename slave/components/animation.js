var Neopixels = require('neopixels');


// Constructor
function Animation(args) {
  // Wrapper to send data to the NeoPixels
  this.neopixels = new Neopixels();

  this.counter = 0;

  this.volume = 0;

  this.lastVolume = 0;

  this.initialized = false;

  this.trail = -1;

  this.isTower = false;

  this.isWall = false;
}
 
// Define propertys and functions
Animation.prototype = {
  constructor : Animation,

  init : function(args) {
    this.amountLeds = args.amountLeds;

    this.buffer = new Buffer(args.amountLeds * 3);

    this.initialized = true;

    if (this.amountLeds == (30 * 5)) {
      this.trail = 2;
      this.isTower = true;
    }

    if (this.amountLeds == (14 * 10)) {
      this.trail = -1;
      this.isWall = true;
    }
  },
 
  fillLed : function(position, color) {
    this.buffer[(position * 3)] = color[0];
    this.buffer[(position * 3) + 1] = color[1];
    this.buffer[(position * 3) + 2] = color[2];
  },


  randomValue : function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },


  setVolume : function(volume) {
    this.volume = volume;
  },



  kickDefault : function() {

    // Something is playing
    if (this.volume > 1) {

      if (this.counter++ > this.trail) {
        this.buffer.fill(0x00);
        this.counter = 0;
      }

      var amount = this.amountLeds / 145 * this.volume;
      var position;

      if (this.isWall) {
        position = this.amountLeds - (this.amountLeds / 145 * this.volume);
      } else {
        position = (this.amountLeds / 145 * this.volume);
      }

      if (this.lastVolume == this.volume) {

          var shit = this.randomValue(position - this.randomValue(5, 15), position + this.randomValue(5, 15));

          // this.fillLed(shit - this.randomValue(15, 20), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(shit - this.randomValue(10, 15), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(shit - this.randomValue(5, 10), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(shit - this.randomValue(1, 5), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(shit, [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(shit + this.randomValue(1, 5), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(shit + this.randomValue(5, 10), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(shit + this.randomValue(10, 15), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(shit + this.randomValue(15, 20), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);

          for (var i = 0; i < 8; i++) {
            this.fillLed(shit - (i * this.randomValue(1, 4)), [this.randomValue(0, this.randomValue(50, 125)), this.randomValue(0, this.randomValue(50, 125)), this.randomValue(0, this.randomValue(50, 125))]); // this.randomValue(0, 255)
          }

      } else {
          // this.fillLed(position - this.randomValue(15, 20), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(position - this.randomValue(10, 15), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(position - this.randomValue(5, 10), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(position - this.randomValue(1, 5), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(position, [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(position + this.randomValue(1, 5), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(position + this.randomValue(5, 10), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(position + this.randomValue(10, 15), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);
          // this.fillLed(position + this.randomValue(15, 20), [this.randomValue(0, 255), this.randomValue(0, 25), this.randomValue(0, 50)]);

        for (var j = 0; j < 8; j++) {
          this.fillLed(position - j, [this.randomValue(0, this.randomValue(50, 125)), this.randomValue(0, this.randomValue(50, 125)), this.randomValue(0, this.randomValue(50, 125))]); // this.randomValue(0, 255)
        }
        this.lastVolume = this.volume;
      }
    
      // Send buffer to NeoPixel
      this.neopixels.animate(this.amountLeds, this.buffer);
    } else {
      // this.buffer.fill(0x00);
      // this.neopixels.animate(this.amountLeds, this.buffer);
    }
    
    // Start the event again
    setTimeout(this.kickDefault.bind(this), 1000 / 24);
  }

};
 
 
// Export ClassName
module.exports = Animation;