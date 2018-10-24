(function(){
	var _this = this;
	_this.clickDownOnEntity = function(entityID, event){
	print("I was clicked!");
	changeColor(entityID);
        var changeColor = function(entityID){       
        var newRed = Math.random()*255;
        var newGreen = Math.random()*255;
        var newBlue = Math.random()*255;    

        var newProperty = { color: {red: newRed, green: newGreen, blue: newBlue}};
        Entities.editEntity(entityID, newProperty);
    }
    }
})