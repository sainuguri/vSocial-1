// Created by Sai Nuguri
// When run, creates an App on High Fidelity Tablet interface that opens the slides for a VR session available at the URL below

(function() {
	// Every great app starts with a great name (keep it short so that it can fit in the tablet button)
	var APP_NAME = "vSocial";
	// Link to your app's HTML file
	var APP_URL = "https://orientation-day-slides.netlify.com/";
	// Path to the icon art for your app
	var APP_ICON = "http://zoo-keeper-structures-11848.netlify.com/logo.svg";

	// Get a reference to the tablet 
	var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

	// "Install" the new app to the tablet
	// The following lines create a button on the tablet's menu screen
	var button = tablet.addButton({
			icon: APP_ICON,
        	text: APP_NAME
    	});

	// When user click the app button, we'll display our app on the tablet screen
	function onClicked() {
		tablet.gotoWebScreen(APP_URL);
	}
    	button.clicked.connect(onClicked);

	// Provide a way to "uninstall" the app
	// Here, we write a function called "cleanup" which gets executed when
	// this script stops running. It'll remove the app button from the tablet.
	function cleanup() {
        tablet.removeButton(button);
	}
    Script.scriptEnding.connect(cleanup);
}()); 
