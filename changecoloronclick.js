//  changeColorOnClickDown.js
// When attached to an object in High Fidelity, changes its color when it is clicked or picked up.

(function(){ 
    var clicked = false;
    this.clickDownOnEntity = function(entityID, mouseEvent) { 
        if (clicked){
            Entities.editEntity(entityID, { color: { red: 255, green: 0, blue: 0} });
            clicked = false;
        }else{
	   Entities.editEntity(entityID, { color: { red: 0, green: 255, blue: 0} });            
            clicked = true;    
        }
    }; 
})
