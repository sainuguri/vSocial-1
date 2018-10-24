// Created by Sai Nuguri
//
// When run, creates an App on High Fidelity tablet interface to lock an avatar to a specific position
(function() {
	// Every great app starts with a great name (keep it short so that it can fit in the tablet button)
	var APP_NAME = "Pod";
	// Link to your app's HTML file
	//var APP_URL = "http://zoo-keeper-structures-11848.netlify.com/";
	// Path to the icon art for your app
	var APP_ICON = "https://s3.amazonaws.com/how-to-use-controller/lock.svg";

	// Get a reference to the tablet 
	var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
	
	//used for flashing the button upon activation
	var FlashState = false;

	// "Install" the new app to the tablet
	// The following lines create a button on the tablet's menu screen
	var button = tablet.addButton({
			icon: APP_ICON,
        	text: APP_NAME
    	});

	// Used to set the state of the bubble HUD button
    	function writeButtonProperties(parameter) {
        	button.editProperties({isActive: parameter});
    	}	

	// When user click the app button, we'll lock their location to the location of the pod
	//function onClicked() {
		Script.update.connect(function(deltaTime){
		position: { x: MyAvatar.position.x, y: MyAvatar.position.y, z: MyAvatar.position.z }
       		MyAvatar.position = position;
		//MyAvatar.position={x:-42.6593, y:-126.98, z:-20.6034};
	}
    	
	function update() {
	



	}

	

	// Provide a way to "uninstall" the app
	// Here, we write a function called "cleanup" which gets executed when
	// this script stops running. It'll remove the app button from the tablet.
	function cleanup() {
        tablet.removeButton(button);
	}
    Script.scriptEnding.connect(cleanup);
}()); 
