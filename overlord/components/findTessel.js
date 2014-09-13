var tessel = require('tessel');
 
tessel.listDevices(function(err, devices) {

  if (!devices || devices.length === 0) {
    console.error("Couldn't find any Tessels");
  } else {
    tessel.findTessel(
      {
        serial: devices[0].serial
      },
      function(err, client) {
        if(!err) {
          // client emits log messages when tessel does console.log
          client.on('log', function(level,msg) {
            console.log("Tessel:" + msg);
          });
 
          // send tessel a message - could be JSON as well I think
          client.send("Hello from Mac");
        } else {
          console.error("Could not find Tessel");
        }
      }
    );
  }
});