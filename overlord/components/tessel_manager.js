var // Default
    tessel = require('tessel')
;





// Constructor
function TesselManager() {
  // List of connected devices
  this.devices = {};

  // Event names
  this.eventNames = {
    newDevice : 'newDevice',
    receivedMessage : 'receivedMessage'
  };

  // EventEmitter
  this.eventsEmitter = null;
}



// Define propertys and functions
TesselManager.prototype = {
  constructor : TesselManager,


  init : function(args) {
    this.eventEmitter = args.eventEmitter;
  }, // init
 

  /**
   * Find connected devices
   */
  findDevices : function() {

    // Find connected devices
    tessel.listDevices(function(err, devices) {

      // No Tessel could be found
      if (!devices || devices.length === 0) {
        // Remove all references to previously connected devices
        this.devices = {};
      } else {

        for (var i in devices) {
          var _device = devices[i];

          // Device is not yet added to the list of connected devices
          if (typeof this.devices[_device.serialNumber] === 'undefined') {
            this.devices[_device.serialNumber] = _device;

            // Create a direct connection to the device
            this.connectTo(_device);
          }
        }
        
      }

    }.bind(this));

  }, // findDevices


  /**
   * Get a list of connected devices
   * 
   * @return JSON this.devices
   */
  getDevices : function() {
    return this.devices;
  }, // getDevices


  /**
   * Connect to a specific device
   * 
   * @param  Object device
   */
  connectTo : function(device) {
          this.lastTime = 0;
          this.now = 0;

    // Find a specific device
    tessel.findTessel({
      serial: device.serialNumber,
      claim : true,
      appMode : false

    }, function(err, client) {

      // Connecting to the device was successful
      if (!err) {

        // Message from the device
        client.on('message', function(msg) {
          // console.log('received message', msg);

          // Current timestamp
          this.now = Date.now();

          // Last call was > x ms ago
          if (this.now - this.lastTime > 24) {
            this.lastTime = this.now;
            this.eventEmitter.emit(this.eventNames.receivedMessage);
          }

        }.bind(this));

        // Save a reference to the client
        this.devices[device.serialNumber]['client'] = client;

        // Trigger event: New device was added
        this.eventEmitter.emit(this.eventNames.newDevice);
        
      // Could not find the device
      } else {
        console.error("Could not find Tessel", device.serialNumber);
      }

    }.bind(this));

  }
};



 

// Export TesselManager
module.exports = new TesselManager();