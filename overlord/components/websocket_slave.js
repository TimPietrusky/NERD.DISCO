var ws = require("nodejs-websocket");





/**
 * A slave for websocket server: overlord.  
 * 
 */
function WebsocketSlave() {
  // IP of the master
  this.ip = 'localhost:1337';

  // Socket connection
  this.connection = null;

  // Reconnect if connection fails? 
  this.enableReconnect = false;

  // The time in ms between every reconnect
  this.reconnectInterval = 5000;

  // Are we trying to reconnect already?
  this.isReconnecting = false;

  // Custom event emitter
  this.eventEmitter = null;

  // Collected data
  this.data = {
    volume : 0
  };
}
 
// Define propertys and functions
WebsocketSlave.prototype = {
  constructor : WebsocketSlave,
 


  /**
   * Connect to the master server
   *
   * args {
   *   ip // IP + port of the master
   * }
   */
  connect : function(args) {

    // Set variables if args is defined
    if (typeof args != 'undefined') {
      // Set ip
      this.ip = args.ip || this.ip;

      // Should we try reconnect?
      this.enableReconnect = args.enableReconnect || this.enableReconnect;

      // How fast should we reconnect?
      this.reconnectInterval = args.reconnectInterval || this.reconnectInterval;

      this.eventEmitter = args.eventEmitter || this.eventEmitter;
    }

    console.log('try connecting to ', this.ip);

    // Create a connection
    this.connection = ws.connect('ws://' + this.ip, function() {
      console.log('connected to', this.ip);

      // Listen for messages
      this.listen();

    }.bind(this));

    // Error occured
    this.connection.on('error', function(error) {
      console.error('error:', error.code);

      // Try to reconnect
      this.reconnect();
    }.bind(this));

    // Connection was closed
    this.connection.on('close', function(code, reason) {
      console.log('close:', code, reason);

      // Try to reconnect
      this.reconnect();
    }.bind(this));
  },



  /**
   * Reconnect to the master
   * 
   */
  reconnect : function() {
    if (this.enableReconnect && !this.isReconnecting) {
      this.isReconnecting = true;

      setTimeout(function() {
        console.log('Trying to reconnect...');

        // Connect
        this.connect();

        // Reconnecting finished
        this.isReconnecting = false;
      }.bind(this), this.reconnectInterval);
    }
  },



  /**
   * Listen for messages from the master.
   * 
   */
  listen : function() {
    // When we get text back
    this.connection.on('text', function(text) {
      this.data = JSON.parse(text);
      this.eventEmitter.emit('websocketData');
    }.bind(this));
  },


  getData : function() {
    return this.data;
  }
};



 

// Export
module.exports = new WebsocketSlave();