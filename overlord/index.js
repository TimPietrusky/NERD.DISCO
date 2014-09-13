var // Default
    events = require('events'),
    _eventEmitter = new events.EventEmitter(),

    // Custom
    _websocketSlave = require('./components/websocket_slave'),
    _tesselManager = require('./components/tessel_manager'),
    _config = {}
;

// Create a connetion to the master
_websocketSlave.connect(
  {
    ip : '192.168.55.101:1337',
    enableReconnect : true,
    eventEmitter : _eventEmitter
  }
);

// Listen to events from TesselManager
_eventEmitter.on(_tesselManager.eventNames.newDevice, function() {
  console.log('device added');
});

// Initialize the TesselManager
_tesselManager.init({
  eventEmitter : _eventEmitter
});

// Configuration for the connected Tessels
_config = {
  devices : {
    'TM-00-04-f0009a30-006a4345-5a9e6249' : {
      name : 'a',
      leds : 30 * 5
    },

    'TM-00-04-f000da30-006d4f3b-32442586' : {
      name : 'b',
      leds : 14 * 10
    }
  }
};

var devices = null;
var _websocketData = null;

function start() {
  devices = _tesselManager.getDevices();

  if (Object.keys(devices).length > 0) {
    var serials = Object.keys(devices);

    for (var i = 0; i < serials.length; i++) {
      sendData(devices, serials[i]);
    }
  }
}

/**
 * Send data to a device specified by serial. 
 * 
 */
function sendData(devices, serial) {
  if (Object.keys(devices).length > 0 && devices[serial] !== undefined && devices[serial].client !== undefined) {

    _websocketData = _websocketSlave.getData();

    data = {
      volume : _websocketData.volume,
      leds : {
        amount : _config.devices[serial].leds
      }
    };

    try {
      // console.log(serial, data);
      devices[serial].client.send(data);
    } catch (e) {
      console.log('ERROROROROR', e);
      devices[serial] = undefined;
    }
    
  }
}

_eventEmitter.on(_tesselManager.eventNames.receivedMessage, function() {
  start();
});

_eventEmitter.on(_tesselManager.eventNames.newDevice, function() {
  console.log('new device');
  start();
});


/**
 * Find new devices
 * 
 */
setInterval(function() {
  _tesselManager.findDevices();
}, 500);