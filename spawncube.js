var position = Vec3.sum(MyAvatar.position, Quat.getFront(MyAvatar.orientation));
var id = Entities.addEntity({
    position: position,
    "script": Script.resolvePath("cube.js"),
    type: "Box",
    name: "ScriptBox",
    color: { red: 0, green: 0, blue: 155 }
});
print("Made a cube!" , id);