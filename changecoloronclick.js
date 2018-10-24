//  changeColorOnClickDown.js
// created by Sai Nuguri
// Once attached to an entity (cube or sphere) in the VR world, changes the color of the entity when picked up or clicked on
(function(){ 
    var clicked = false;
    this.clickDownOnEntity = function(entityID, mouseEvent) { 
        if (clicked){
            Entities.editEntity(entityID, { color: { red: 41, green: 40, blue: 41} });
            clicked = false;
        }else{
            Entities.editEntity(entityID, { color: { red: 0, green: 255, blue: 255} });
            clicked = true;    
        }
    }; 
})
