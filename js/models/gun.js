mat["gun"]=new THREE.MeshStandardMaterial({
map:tex["gun_d"],
normalMap:tex["gun_n"],
normalScale:{x:2,y:2},
aoMap:tex["gun_ao"],
metalnessMap:tex["gun_m"],
metalness:0.4,
roughnessMap:tex["gun_r"],
roughness:1.2,
});


// ____________________ GUN ____________________


OBJLoader.load("./models/gun/gun.obj",function(object){


while(object.children.length){


let name=object.children[0].name;


mesh[name]=object.children[0];


mesh[name].position.set(0,0,0);
mesh[name].scale.set(100,100,100);
mesh[name].castShadow=true;
mesh[name].receiveShadow=true;


object.children.splice(0,1);


}


});


mat["gun_2_armmesh"]=new THREE.MeshStandardMaterial({
map:tex["armhandcolor"],
});


mat["gun_2_gun"]=new THREE.MeshStandardMaterial({
map:tex["taloncolor"],
normalMap:tex["talonnormal"],
metalness:0.5,
roughnessMap:tex["talonmetallic"],
roughness:0.4,
});


FBXLoader.load("./models/heavy_pistol_animated/arms_talon.fbx",function(object){


mesh["gun_2"]=object;


mesh["gun_2"].traverse(function(child){
if(child.isMesh){
child.receiveShadow=true;
}
if(child.isMesh && child.name=="armmesh"){
child.material=mat["gun_2_armmesh"];
}
if(child.isMesh && child.name!="armmesh"){
child.material=mat["gun_2_gun"];
}
});


mixer["gun_2"]=new THREE.AnimationMixer(mesh["gun_2"]);


action["gun_2_shoot"]=THREE.AnimationUtils.subclip(mesh["gun_2"].animations[0],"attack",0,13);
action["gun_2_shoot"]=mixer["gun_2"].clipAction(action["gun_2_shoot"]);
action["gun_2_shoot"].timeScale=1.5;
action["gun_2_shoot"].setLoop(THREE.LoopOnce);
action["gun_2_shoot"].play();
action["gun_2_shoot"].enabled=false;
mixers.push(mixer["gun_2"]);


action["gun_2_reload"]=THREE.AnimationUtils.subclip(mesh["gun_2"].animations[0],"attack",14,85);
action["gun_2_reload"]=mixer["gun_2"].clipAction(action["gun_2_reload"]);
action["gun_2_reload"].timeScale=0.9;
action["gun_2_reload"].setLoop(THREE.LoopOnce);
action["gun_2_reload"].play();
action["gun_2_reload"].enabled=false;


});