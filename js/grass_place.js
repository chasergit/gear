function grass_place(){


let start_ms=performance.now();


dummy["instance"]=new THREE.Object3D();
let total=0;
let count=0;


for(let i=0;i<50;i++){
for(let j=0;j<50;j++){


count=grass_instance_create(-50+i*100,0,-250+j*100,100,100,1.50,"grass","grass_long","grass_long_1");
total+=count;
//c=grass_instance_create(-2500+i*100,0,-500+j*100,100,5000,1.50,"grass","grass_long","grass_long_1");
total+=count;
//c=grass_instance_create(-50+i*100,0,-50+j*100,100,2000,1.50,"grass","grass_long","grass_long_1");
total+=count;


}
}
//c=grass_instance_create(50,0,0,100,400,1.50,"grass","grass_long","grass_long_1");
total+=count;
//c=grass_instance_create(50,0,50,100,400,1.50,"grass","grass_long","grass_long_1");
total+=count;


debug_text.push(["grass_placed","<font>["+total+"]</font> "+(performance.now()-start_ms).toFixed(3)+""]);


}