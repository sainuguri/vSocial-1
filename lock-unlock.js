// Created by Sai Nuguri
// Trial script to create an App on High Fidelity tablet interface to lock an avatar to a location.

(function() { 
// Every great app starts with a great name (keep it short so that it can fit in the tablet button)
var APP_NAME = "Lock";   

var APP_URL = "https://s3.amazonaws.com/how-to-use-controller/lock-unlock.html";

// Path to the icon art for your app
var APP_ICON = "https://s3.amazonaws.com/how-to-use-controller/lock.svg";

// Get a reference to the tablet 
var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

// "Install" your cool new app to the tablet
// The following lines create a button on the tablet's menu screen
var button = tablet.addButton({ 
icon: APP_ICON,
text: APP_NAME
});

// Link to your app's HTML file
// When user click the app button, we'll display our app on the tablet screen
function onClicked() {
  tablet.gotoWebScreen(APP_URL);
}
button.clicked.connect(onClicked);

// Handle the events we're receiving from the web UI
function onWebEventReceived(event) {
   print("lock-unlock.js received a web event: " + event);
// Converts the event to a JavasScript Object
    	if (typeof event === "string") {
            event = JSON.parse(event);
        }

        	if (event.data  === "Lock") {
		Script.update.connect(function(deltatime){	
        		MyAvatar.position = { x: 94.6033, y: -238.705 ,z: -605.104 };
		});
		} else if (event.data  === "Unlock") {
                tablet.removeButton(button);
        	}
}
tablet.webEventReceived.connect(onWebEventReceived);

// Provide a way to "uninstall" the app
// Here, we write a function called "cleanup" which gets executed when
// this script stops running. It'll remove the app button from the tablet.
function cleanup() { 
tablet.removeButton(button);
}
Script.scriptEnding.connect(cleanup); 
}());
