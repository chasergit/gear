let sprite=[];


sprite["flare"]=[];
sprite["wall"]=[];
sprite["shine"]=[];
sprite["beam"]=[];
sprite["weapon_smoke"]=[];
sprite["weapon_muzzle_flash"]=[];


sprite["debris"]=[];


sprite["wolf"]=[];
sprite["soul"]=[];
sprite["other"]=[];
sprite["blood"]=[];


sprite["muzzle_spark"]=[];


sprite["planets"]=[];
let planets_origin_x=30;
let planets_origin_y=10;
let planets_origin_z=15;


let planets_list=["sun","mercury","venus","earth","moon","mars","jupiter","saturn","uranus","neptune","pluto"];
let planets_raycast=[];


let planets_saying_status=0;
let planets_saying_time=0;
let planets_saying_name="";
let planets_mode=0;
planets_list.sort(()=>0.5-Math.random());
let planets_game_found=0;
let planets_game_status=0;
let planets_game_time=0;


document.addEventListener("keyup",(event)=>{
if(event.code=="KeyM"){
if(planets_mode==0){ planets_mode=1; planets_game_status=0; planets_game_time=0; }
else{ planets_mode=0; }
}
});


function sprites_set(){


sprite["planets"]["sun"]={origin:[0,0,0],offset:[0,0,0],scale:[5,5],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["sun"][0],texture:atlas["sun"][1]};
sprite["planets"]["mercury"]={origin:[3,0,0],offset:[0,0,0],scale:[1,1],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["mercury"][0],texture:atlas["mercury"][1]};
sprite["planets"]["venus"]={origin:[5,0,0],offset:[0,0,0],scale:[1.2,1.2],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["venus"][0],texture:atlas["venus"][1]};
sprite["planets"]["earth"]={origin:[7,0,0],offset:[0,0,0],scale:[1.3,1.3],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["earth"][0],texture:atlas["earth"][1]};
sprite["planets"]["moon"]={origin:[7,0,0],offset:[0,0,0],scale:[0.5,0.5],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["moon"][0],texture:atlas["moon"][1]};
sprite["planets"]["mars"]={origin:[9,0,0],offset:[0,0,0],scale:[1.1,1.1],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["mars"][0],texture:atlas["mars"][1]};
sprite["planets"]["jupiter"]={origin:[11,0,0],offset:[0,0,0],scale:[2.5,2.5],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["jupiter"][0],texture:atlas["jupiter"][1]};
sprite["planets"]["saturn"]={origin:[12.2,0,0],offset:[0,0,0],scale:[3.0,3.0],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["saturn"][0],texture:atlas["saturn"][1]};
sprite["planets"]["uranus"]={origin:[13,0,0],offset:[0,0,0],scale:[2.3,2.3],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["uranus"][0],texture:atlas["uranus"][1]};
sprite["planets"]["neptune"]={origin:[14,0,0],offset:[0,0,0],scale:[1.5,1.5],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["neptune"][0],texture:atlas["neptune"][1]};
sprite["planets"]["pluto"]={origin:[15,0,0],offset:[0,0,0],scale:[0.7,0.7],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["pluto"][0],texture:atlas["pluto"][1]};


mat["planets"]=new THREE.MeshBasicMaterial();


let max=planets_list.length;
for(let n=0;n<max;n++){
mesh[planets_list[n]]=new THREE.Mesh(new THREE.SphereGeometry(sprite["planets"][planets_list[n]].scale[0]*0.5,6,6),mat["planets"]);
mesh[planets_list[n]].name=planets_list[n];
mesh[planets_list[n]].visible=false;
scene.add(mesh[planets_list[n]]);
planets_raycast.push(mesh[planets_list[n]]);
}


sprite["flare"].push({offset:[-0.8,0.2,-8],scale:[0.2,0.2],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["flare"].push({offset:[-0.8,0.2,-9],scale:[0.2,0.2],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["flare"].push({offset:[-0.8,0.2,-10],scale:[0.2,0.2],quaternion:[0,0,0,5],rotation:[0,0],color:[0,1,1,1],blend:0,soft:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["flare"].push({offset:[-0.8,0.2,-11],scale:[0.2,0.2],quaternion:[0,0,0,5],rotation:[0,0],color:[0,1,1,1],blend:0,soft:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["flare"].push({offset:[-0.8,0.2,-12],scale:[0.2,0.2],quaternion:[0,0,0,5],rotation:[0,0],color:[1,0.4,0,1],blend:0,soft:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["flare"].push({offset:[-0.8,0.2,-13],scale:[0.2,0.2],quaternion:[0,0,0,5],rotation:[0,0],color:[1,0.4,0,1],blend:0,soft:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});


sprite["flare"].push({offset:[-0.7,2.6,-19.6],scale:[1.0,1.0],quaternion:[0,0,0,5],rotation:[0,0],color:[1,0.7,0,1],blend:0,soft:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});


sprite["flare"].push({offset:[-6.0,0.3,-16.9],scale:[0.5,0.5],quaternion:[0,0,0,5],rotation:[0,0],color:[0,1,1,1],blend:0,soft:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["flare"].push({offset:[-8.3,0.3,-16.9],scale:[0.5,0.5],quaternion:[0,0,0,5],rotation:[0,0],color:[0,1,1,1],blend:0,soft:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["flare"].push({offset:[-10.8,0.3,-16.9],scale:[0.5,0.5],quaternion:[0,0,0,5],rotation:[0,0],color:[0,1,1,1],blend:0,soft:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});


for(let n=0;n<100;n++){
let x=(Math.random()*2-1)*3;
let z=(Math.random()*2-1)*3;
sprite["flare"].push({offset:[-4.7+x,0.05,6.9+z],scale:[0.2,0.2],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
}


sprite["debris"].push({offset:[14,1.5,-2.5],scale:[0.2,0.2],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["debris_d"][0],texture:atlas["debris_d"][1]});


sprite["wall"].push({offset:[2.0,1.5,-14.3],scale:[0.5,0.5],quaternion:[0,0,0,5],rotation:[0,0],color:[0,1,1,1],blend:0,soft:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});


sprite["shine"].push({offset:[3.0,1.5,-14.3],scale:[0.5,0.5],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["flare_blue"][0],texture:atlas["flare_blue"][1]});


for(let n=0;n<8;n++){
sprite["beam"].push({offset:[-1.4-n*1.6,0.2,-19.75],scale:[0.2,1.4],quaternion:[1,0,0,7],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["light_10"][0],texture:atlas["light_10"][1]});
}


sprite["wolf"]["eye_1"]={offset:[0,0,0],scale:[0.2,0.2],quaternion:[0,0,0,5],rotation:[0,0],color:[1,0.4,1,5],blend:0,soft:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]};
sprite["wolf"]["eye_2"]={offset:[0,0,0],scale:[0.2,0.2],quaternion:[0,0,0,5],rotation:[0,0],color:[1,0.4,1,5],blend:0,soft:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]};
sprite["wolf"]["tail"]={offset:[0,0,0],scale:[1,1],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]};


sprite["soul"]["soul_1_1"]={origin:[13,1.2,4],offset:[13,1,4],scale:[1,1],quaternion:[0,0,0,5],rotation:[-0.002,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["flare_blue"][0],texture:atlas["flare_blue"][1]};
sprite["soul"]["soul_1_2"]={origin:[13,1.2,4],offset:[13,1,4],scale:[1,1],quaternion:[0,0,0,5],rotation:[0.002,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["flare_blue"][0],texture:atlas["flare_blue"][1]};
sprite["soul"]["soul_2_1"]={origin:[30,1,0],offset:[13,1,4],scale:[5,5],quaternion:[0,0,0,5],rotation:[-0.002,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["flare_blue"][0],texture:atlas["flare_blue"][1]};
sprite["soul"]["soul_2_2"]={origin:[30,1,0],offset:[13,1,4],scale:[5,5],quaternion:[0,0,0,5],rotation:[0.002,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["flare_blue"][0],texture:atlas["flare_blue"][1]};


sprite["other"].push({offset:[-4.35,1.1,1.7],scale:[1,1],quaternion:[0,0,1,11],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["other"].push({offset:[-5.6,1.1,1.7],scale:[1,1],quaternion:[0,0,0,15],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});


sprite["other"].push({offset:[9,1.5,1],scale:[1,1],quaternion:[0,0,0,6],rotation:[-0.002,0],color:[0,0,0,1],blend:1,soft:0,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[9.5,1.5,1],scale:[1,1],quaternion:[0,0,0,6],rotation:[-0.002,0],color:[0,0,0,1],blend:1,soft:0,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[9.5,1.5,0.5],scale:[1,1],quaternion:[0,0,0,6],rotation:[-0.002,0],color:[1,0.8,0,1],blend:1,soft:0,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[10.0,1.5,1],scale:[1,1],quaternion:[0,0,0,6],rotation:[-0.002,0],color:[0,0,0,1],blend:1,soft:0,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[9.5,1.5,1.5],scale:[1,1],quaternion:[0,0,0,6],rotation:[-0.002,0],color:[1,0,0,1],blend:1,soft:0,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});


sprite["other"].push({offset:[9.5,1,-2],scale:[5,1],quaternion:[0,0.7,0,0.7],rotation:[0.001,0],color:[1,1,1,1],blend:1.1,soft:0,frame:atlas["fire"][0],texture:atlas["fire"][1]});


sprite["other"].push({offset:[7,1,10],scale:[1,1],quaternion:[0,0,0,6],rotation:[-0.002,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["glass_1"][0],texture:atlas["glass_1"][1]});


sprite["other"].push({offset:[7,1,6],scale:[4,4],quaternion:[0,0,0,6],rotation:[0.001,0],color:[1,1,1,1],blend:1,soft:1,frame:atlas["smoke"][0],texture:atlas["smoke"][1]});
sprite["other"].push({offset:[6,1,4],scale:[4,4],quaternion:[0,0,0,6],rotation:[0.001,0],color:[1,1,1,1],blend:1,soft:1,frame:atlas["smoke"][0],texture:atlas["smoke"][1]});
sprite["other"].push({offset:[7,1,4],scale:[4,4],quaternion:[0,0,0,6],rotation:[0.001,0],color:[1,1,1,1],blend:1,soft:1,frame:atlas["smoke"][0],texture:atlas["smoke"][1]});


sprite["other"].push({offset:[9.5,1,4.5],scale:[1,1],quaternion:[0,0,0,6],rotation:[-0.002,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});


sprite["other"].push({offset:[7,1,2],scale:[1,1],quaternion:[0,0,0,6],rotation:[0.002,0],color:[1,1,0,1],blend:1,soft:0,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[7,1,2.5],scale:[1,1],quaternion:[0,0,0,6],rotation:[0.001,0],color:[1,0,1,1],blend:1,soft:0,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[7,1,3],scale:[1,1],quaternion:[0,0,0,6],rotation:[0.003,0],color:[0,1,1,1],blend:1,soft:0,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});


sprite["other"].push({offset:[-300,200,0],scale:[100,100],quaternion:[0,1,0,7],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});


sprite["other"].push({offset:[-1.05,1.25,-8.5],scale:[0.2,1.0],quaternion:[0,1,0,7],rotation:[0,0],color:[0,0.9,0.81,1],blend:0,soft:0,frame:atlas["beam"][0],texture:atlas["beam"][1]});
sprite["other"].push({offset:[-1.05,1.25,-10.0],scale:[0.2,1.0],quaternion:[0,1,0,7],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[20,1.7,-4.0],scale:[1.0,4.],quaternion:[-1,0,0,7],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["glass_1"][0],texture:atlas["glass_1"][1]});
sprite["other"].push({offset:[20,1.25,1.5],scale:[0.4,10.],quaternion:[0,0,1,7],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[20,1.0,1.5],scale:[0.4,10.],quaternion:[0,0,1,7],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[21,1.0,-3],scale:[0.4,0.4],quaternion:[0,0,1,6],rotation:[0,0],color:[2.0,1,1,1],blend:0,soft:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[26,1.0,1.5],scale:[0.4,10.],quaternion:[0,1,0,7],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[20,3.0,1.5],scale:[0.4,10.],quaternion:[0,0,1,7],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[14.22,1.0,55.6],scale:[2.0,4.0],quaternion:[15.0,1.0,55.3,4],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["water_drop"][0],texture:atlas["water_drop"][1]});
sprite["other"].push({offset:[21,1.0,1.5],scale:[0.1,10.],quaternion:[0,0,1,7],rotation:[0,0],color:[1,1,1,0.5],blend:1,soft:0,frame:atlas["smoke"][0],texture:atlas["smoke"][1]});
sprite["other"].push({offset:[24,1.25,-2.6],scale:[1.0,0.5],quaternion:[0,1,1,4],rotation:[0.001,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[-1.05,1.25,-13.0],scale:[0.2,1.0],quaternion:[0,1,0,7],rotation:[0,0],color:[0,0.9,0.81,1],blend:0,soft:0,frame:atlas["beam"][0],texture:atlas["beam"][1]});

sprite["other"].push({offset:[18,1.25,6],scale:[0.4,10.],quaternion:[0,0,1,8],rotation:[0,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["tracer"][0],texture:atlas["tracer"][1]});


sprite["other"].push({offset:[-1.05,1.3,-10.75],scale:[1.2,0.8],quaternion:[0,0.7,0,0.7],rotation:[0,0],color:[1,1,1,1],blend:0.8,soft:0,frame:atlas["glass_1"][0],texture:atlas["glass_1"][1]});


sprite["other"].push({offset:[-0.1,1.7,13],scale:[2,1.4],quaternion:[0,0.7,0,0.7],rotation:[0,0],color:[1,1,1,0.4],blend:0,soft:0,frame:atlas["window"][0],texture:atlas["window"][1]});
sprite["other"].push({offset:[14.0,1.7,-5.1],scale:[2,1.4],quaternion:[0,0,0,1],rotation:[0,0],color:[1,1,1,0.4],blend:0,soft:0,frame:atlas["window"][0],texture:atlas["window"][1]});


sprite["other"].push({offset:[16,1.0,0],scale:[1.0,1.0],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["homer"][0],texture:atlas["homer"][1]});
sprite["other"].push({offset:[16,1.5,0],scale:[1.0,0.25],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["avatar"][0],texture:atlas["avatar"][1]});


sprite["other"].push({offset:[18,1.0,0],scale:[1.0,1.0],quaternion:[0,0,0,5],rotation:[0.001,0],color:[1,1,1,1],blend:0,soft:0,frame:atlas["shot"][0],texture:atlas["shot"][1]});


sprite["other"].push({offset:[35,0.0,72],scale:[2,2],quaternion:[0,0,0,6],rotation:[0.001,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["water_splash"][0],texture:atlas["water_splash"][1]});
sprite["other"].push({offset:[35,0.0,72],scale:[1.8,1.8],quaternion:[0,0,0,6],rotation:[-0.001,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["water_splash"][0],texture:atlas["water_splash"][1]});


}


function sprites_soul_f(){
	
	
let y=sprite["soul"]["soul_1_1"].origin[1]+Math.sin(time/1000)/6;
sprite["soul"]["soul_1_1"].offset[1]=y;
sprite["soul"]["soul_1_2"].offset[1]=y;
let p=sprite["soul"]["soul_2_1"].origin;
let x=p[0]+Math.sin(time/2000)*2;
y=p[1]+Math.sin(time/500)*1;
let z=p[2]+Math.cos(time/2000)*2;
sprite["soul"]["soul_2_1"].offset=[x,y,z];
sprite["soul"]["soul_2_2"].offset=[x,y,z];


}


function sprites_calculations(){
	
	
	
// ____________________ ВОДОПАД ____________________


sprite["other"][25].frame[3]=-time/500;


// ____________________ ДУША ____________________


sprites_soul_f();


// ____________________ ВОЛК ____________________


if(wolf_tail_bone){


let item_1=mesh["eye_1"].matrixWorld.elements;
let item_2=sprite["wolf"]["eye_1"].offset;
item_2[0]=item_1[12];
item_2[1]=item_1[13];
item_2[2]=item_1[14];


item_1=mesh["eye_2"].matrixWorld.elements;
item_2=sprite["wolf"]["eye_2"].offset;
item_2[0]=item_1[12];
item_2[1]=item_1[13];
item_2[2]=item_1[14];


for(let n=0;n<1;n++){
wolf_tail[0][0].multiplyMatrices(wolf_tail[0][1],wolf_tail[0][2]);
let item_1=wolf_tail[0][3];
let item_2=sprite["wolf"]["tail"].offset;
item_2[0]=item_1[12];
item_2[1]=item_1[13];
item_2[2]=item_1[14];
}


}


// ____________________ КРОВЬ ____________________


for(let i in sprite["blood"]){
	
	
let item=sprite["blood"][i];
if(item.time<0){ delete sprite["blood"][i]; continue; }
item.time-=delta;
if(item.power>0){
item.power-=0.01;
}
item.power=Math.max(0,item.power);
if(item.type){
item.scale[0]+=0.005;
item.scale[1]+=0.005;
}
item.offset[0]+=item.nx*item.power;
item.offset[1]+=item.ny*item.power;
item.offset[1]-=0.05*item.type;
item.offset[2]+=item.nz*item.power;

if(item.type==0){ continue; }
raycaster.ray.direction.set(0,-1,0);
raycaster.ray.origin.x=item.offset[0];
raycaster.ray.origin.y=item.offset[1];
raycaster.ray.origin.z=item.offset[2];
let hits_a=raycaster.intersectObject(mesh["terrain"],false);
if(hits_a.length>0 && hits_a[0].distance<0.1){


item.time=200;
item.power=0;
item.offset[0]=hits_a[0].point.x+hits_a[0].normal.x*0.05;
item.offset[1]=hits_a[0].point.y+hits_a[0].normal.y*0.05;
item.offset[2]=hits_a[0].point.z+hits_a[0].normal.z*0.05;
item.quaternion[0]=hits_a[0].normal.x;
item.quaternion[1]=hits_a[0].normal.y;
item.quaternion[2]=hits_a[0].normal.z;
item.quaternion[3]=3;
item.type=0;


}


}


// ____________________ ДЫМ ОРУЖИЯ ____________________


for(let i in sprite["weapon_smoke"]){
	
	
let item=sprite["weapon_smoke"][i];
if(item.color[3]<0){ delete sprite["weapon_smoke"][i]; continue; }
item.color[3]-=delta*item.fade_speed;
item.scale[0]+=item.scale_speed;
item.scale[1]+=item.scale_speed;


}


// ____________________ ПЛАМЯ ОРУЖИЯ ____________________


for(let i in sprite["weapon_muzzle_flash"]){
	
	
let item=sprite["weapon_muzzle_flash"][i];
if(item.time>0.016){ delete sprite["weapon_muzzle_flash"][i]; continue; }
item.time+=delta;


item.object.getWorldPosition(vector3);
item.offset=[vector3.x,vector3.y,vector3.z];


}


// ____________________ ИСКРЫ ____________________


for(let i in sprite["muzzle_spark"]){

	
let item=sprite["muzzle_spark"][i];
if(item.time<0){ delete sprite["muzzle_spark"][i]; continue; }
item.time-=delta;
item.offset=[item.offset[0]+item.quaternion[0]*item.speed,item.offset[1]+item.quaternion[1]*item.speed,item.offset[2]+item.quaternion[2]*item.speed];


}


// ____________________ ПЛАНЕТЫ ____________________


let item;
sprite["planets"]["sun"].offset=[planets_origin_x,planets_origin_y,planets_origin_z];
item=sprite["planets"]["mercury"];
sprite["planets"]["mercury"].offset=[planets_origin_x-item.origin[0]*Math.sin(time*0.0004),planets_origin_y,planets_origin_z+item.origin[0]*Math.cos(time*0.0004)];
item=sprite["planets"]["venus"];
sprite["planets"]["venus"].offset=[planets_origin_x-item.origin[0]*Math.sin(1+time*0.000404*0.3),planets_origin_y,planets_origin_z+item.origin[0]*Math.cos(1+time*0.000404*0.3)];
item=sprite["planets"]["earth"];
sprite["planets"]["earth"].offset=[planets_origin_x-item.origin[0]*Math.sin(2+time*0.000409*0.3),planets_origin_y,planets_origin_z+item.origin[0]*Math.cos(2+time*0.000409*0.3)];
item=sprite["planets"]["earth"];
sprite["planets"]["moon"].offset=[planets_origin_x-item.origin[0]*Math.sin(2+time*0.000409*0.3)+Math.sin(time*0.001)*1,planets_origin_y,planets_origin_z+item.origin[0]*Math.cos(2+time*0.000409*0.3)+Math.cos(time*0.001)*1];
item=sprite["planets"]["mars"];
sprite["planets"]["mars"].offset=[planets_origin_x-item.origin[0]*Math.sin(3+time*0.000411*0.3),planets_origin_y,planets_origin_z+item.origin[0]*Math.cos(3+time*0.000411*0.3)];
item=sprite["planets"]["jupiter"];
sprite["planets"]["jupiter"].offset=[planets_origin_x-item.origin[0]*Math.sin(4+time*0.000414*0.3),planets_origin_y,planets_origin_z+item.origin[0]*Math.cos(4+time*0.000414*0.3)];
item=sprite["planets"]["saturn"];
sprite["planets"]["saturn"].offset=[planets_origin_x-item.origin[0]*Math.sin(5+time*0.000416*0.3),planets_origin_y,planets_origin_z+item.origin[0]*Math.cos(5+time*0.000416*0.3)];
item=sprite["planets"]["uranus"];
sprite["planets"]["uranus"].offset=[planets_origin_x-item.origin[0]*Math.sin(6+time*0.000418*0.3),planets_origin_y,planets_origin_z+item.origin[0]*Math.cos(6+time*0.000418*0.3)];
item=sprite["planets"]["neptune"];
sprite["planets"]["neptune"].offset=[planets_origin_x-item.origin[0]*Math.sin(7+time*0.000420*0.3),planets_origin_y,planets_origin_z+item.origin[0]*Math.cos(7+time*0.000420*0.3)];
item=sprite["planets"]["pluto"];
sprite["planets"]["pluto"].offset=[planets_origin_x-item.origin[0]*Math.sin(8+time*0.00043*0.3),planets_origin_y,planets_origin_z+item.origin[0]*Math.cos(8+time*0.00043*0.3)];


let max=planets_list.length;
for(let n=0;n<max;n++){
let item=sprite["planets"][planets_list[n]].offset;
mesh[planets_list[n]].position.set(item[0],item[1],item[2]);
}


if(planets_mode==0){
	
	
if(planets_saying_time<=0){
raycaster.ray.direction.set(camera_direction_x,camera_direction_y,camera_direction_z);
raycaster.ray.origin.copy(camera_position);
let hits_a=raycaster.intersectObjects([...planets_raycast],true);
if(hits_a.length>0 && planets_saying_name!=hits_a[0].object.name){
planets_saying_name=hits_a[0].object.name;
planets_saying_time=1.5;
sounds_play(null,hits_a[0].object.name,false,false,1,0,3,false,"","");
}
}
else{
planets_saying_time-=delta;
}


}


if(planets_mode==1){
	



if(planets_game_status==0){
sounds_play(null,"show_where",false,false,1,0,3,false,"","");
planets_game_status=1;
planets_game_time=0;
}	
	
	
if(planets_game_status==1 && planets_game_time>1.3){
planets_game_time=0;
planets_game_status=2;
sounds_play(null,planets_list[planets_game_found],false,false,1,0,3,false,"","");	
}

	
if(planets_game_status==2 && planets_game_time>2){
console.log("check")
raycaster.ray.direction.set(camera_direction_x,camera_direction_y,camera_direction_z);
raycaster.ray.origin.copy(camera_position);
let hits_a=raycaster.intersectObjects([...planets_raycast],true);
if(hits_a.length>0 && hits_a[0].object.name==planets_list[planets_game_found]){
planets_game_found++;
if(planets_game_found>planets_list.length){
planets_game_found=0;
planets_list.sort(()=>0.5-Math.random());
}
planets_game_status=3;
planets_game_time=0;
sounds_play(null,"ok_2",false,false,1,0,3,false,"","");
}
}


if(planets_game_status==3 && planets_game_time>2){
sounds_play(null,"win",false,false,1,0,3,false,"","");
planets_game_status=4;
planets_game_time=0;
}


if(planets_game_status==4 && planets_game_time>5){
planets_game_status=0;
planets_game_time=0;
}


planets_game_time+=delta;


}


}