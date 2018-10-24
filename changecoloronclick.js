//  changeColorOnClickDown.js
// https://www.dropbox.com/s/nrf6p1p47zt7gxa/changeColorOnClickDown.js?dl=0
// &
// http://business.ozblog.me/scripts/changeColorOnClickDown.js

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