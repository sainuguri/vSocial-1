//trying to find ou issues with sim performance.
//Chris Collins 1/14/2017

(function() {
  var _this = this;

  // The url of the macro
  var STAT_GOOGLE_SCRIPT_URL = //"https://script.google.com/macros/s/AKfycbxxphmPhZHAL9rwckMPrJp6bOsJYRiRCeLZkefyINnGZaxA8cY/exec";

//"https://script.google.com/d/1d0vrVn6zuMxSVxdXQZ_WicpIJ6LYSXxTDubf31rg85XOCZCo_QhtVJwR/edit?usp=sharing"

"https://script.google.com/macros/d/MjoJO-G18ZfYKrpIo8-SF0zpxPaZZEahU/edit?uiv=2&mid=ACjPJvGQ1lX8ITeGG2rqTUmCN8REeHjWZrCsWJEHYXcEB44zpS4tl2UVu6JYFfz7WoHtWLFPM9SWCOKBCSsFVtLzeqniHdVk7xCFEeAs0gngFnSXD0J47Iq8ZH31GZCM9ntbjEliCIGcBl8";

  // Send the data every:
  var SEND_EVERY = 5000; // 30 seconds

  function sendStats() {
    Stats.forceUpdateStats();
    var req = new XMLHttpRequest();
    req.open("POST", STAT_GOOGLE_SCRIPT_URL, false);
    req.send(JSON.stringify({
        username: GlobalServices.username,
        location: Window.location.hostname,
        framerate: Stats.renderrate,
        simrate: Stats.presentrate,
        ping: {
          audio: Stats.audioPing,
          avatar: Stats.avatarPing,
          entities: Stats.entitiesPing,
          asset: Stats.assetPing
        },
        position: Camera.position,
        yaw: Stats.yaw,
        rotation: 
          Camera.orientation.x + ',' + 
          Camera.orientation.y + ',' + 
          Camera.orientation.z + ',' + 
          Camera.orientation.w,
        packetloss: {
            audioUpstream: 0,
            audioDownstream: 0
        }
    }));
    print(req.status);
    print(req.responseText);
}
  
  Script.setInterval(sendStats, SEND_EVERY);
  sendStats();
  
 _this.enterEntity = function(entityID) {
    print('I am insiude');
 
    //send data once
    sendStats();
  };


 _this.leaveEntity = function(entityID) {
    print('I am outside');
  };
  
});