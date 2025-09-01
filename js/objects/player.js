let world_octree=new Octree();
let world_gravity=30;


let player=new THREE.Object3D();
player.position.set(23,2,0.2);
scene.add(player);


let player_direction={x:0,y:0,z:1};
let player_angle={y:90,x:180};
let player_angle_y_min=10; // МИНИМАЛЬНЫЙ УГОЛ ВЗОРА
let player_angle_y_max=170; // МАКСИМАЛЬНЫЙ УГОЛ ВЗОРА
let player_height=1.80; // РОСТ
let player_eyes=1.70; // УРОВЕНЬ ГЛАЗ
let player_radius=0.25; // РАДИУС ИГРОКА
let player_floor=-20; // НИЖЕ КАКОЙ ВЫСОТЫ ИГРОК НЕ МОЖЕТ УПАСТЬ
let player_look_sensitivity=0.12; // ЧУВСТВИТЕЛЬНОСТЬ ПОВОРОТА


let player_footstep_last=0;


let player_steps_time=0;
let player_landed=true;


let player_collider=new Capsule();
player_collider.radius=player_radius;
player_collider.start.set(player.position.x,player.position.y+player_radius,player.position.z);
player_collider.end.set(player.position.x,player.position.y+player_height-player_radius,player.position.z);
let player_velocity=new THREE.Vector3();
let playerDirection=new THREE.Vector3();
let player_move=new THREE.Vector3();
let player_on_floor=false;
let player_speed_go=15;
let player_speed_run=25;
let player_speed_floor=player_speed_go;
let player_speed_fly=8;
let player_speed_jump=7;
let player_friction_now=1; // НЕ МЕНЯТЬ 
let player_friction=4; // СИЛА ТРЕНИЯ НА ЗЕМЛЕ, КОГДА ПЕРЕСТАЁТ ИДТИ, ЧТОБЫ БЫСТРО ОСТАНОВИТЬСЯ
let player_fly=false;
let player_noclip=false;


let player_tall=new THREE.Object3D();
let player_head=new THREE.Object3D();
player_tall.position.y=player_eyes;
player.add(player_tall);
player_tall.add(player_head);
player_head.add(camera);


// ____________________ ВЫГЛЯДЫВАНИЕ ____________________


let player_peek_value=0;
let player_peek_in_speed=0.02;
let player_peek_out_speed=0.06;
let player_peek_head_position_x=0.15;
let player_peek_head_position_y=-0.05;
let player_peek_hand_rotation_z=0.1;
let player_peek_camera_rotation_z=0.2;


mesh["player_radius_helper"]=new THREE.Mesh(new THREE.CylinderGeometry(player_radius,player_radius,0.1,32,1),new THREE.MeshBasicMaterial({color:0xffff00,wireframe:true}));
mesh["player_radius_helper"].frustumCulled=false;
player.add(mesh["player_radius_helper"]);


function player_collisions(){


let result=world_octree.capsuleIntersect(player_collider);
player_on_floor=false;
if(result){
player_on_floor=result.normal.y>0;
if(!player_on_floor){ player_velocity.addScaledVector(result.normal,-result.normal.dot(player_velocity)); }
if(result.depth>=1e-10){ player_collider.translate(result.normal.multiplyScalar(result.depth)); }
}


}


function player_update(delta_time){


let damping=Math.exp(-4*delta_time)-1;


if(!player_on_floor && (!player_fly && !player_noclip)){
player_velocity.y-=world_gravity*delta_time;
damping*=0.1; // СОПРОТИВЛЕНИЕ ВОЗДУХА
}


player_velocity.addScaledVector(player_velocity,damping*player_friction_now);
const delta_position=player_velocity.clone().multiplyScalar(delta_time);
player_collider.start.x+=delta_position.x;
player_collider.start.y+=delta_position.y;
player_collider.start.z+=delta_position.z;
player_collider.end.x=player_collider.start.x;
player_collider.end.y=player_collider.start.y+player_height-player_radius*2;
player_collider.end.z=player_collider.start.z;


if(!player_noclip){ player_collisions(); }


if(player_collider.start.y<player_floor+player_radius){
player_on_floor=true;
player_collider.start.y=player_floor+player_radius;
player_collider.end.y=player_floor+player_height-player_radius*2;
player_velocity.y=0;
}


player.position.copy(player_collider.start);
player.position.y-=player_radius;


if(player_on_floor && player_landed==false){  
player_landed=true;
sounds_play(null,"land",false,false,1,0,1,false,"","");
}


}


function player_controls(delta_time){


let speed_delta=delta_time*(player_on_floor?player_speed_floor:player_speed_fly);


player_move.x=0;
player_move.y=0;
player_move.z=0;


if(key_status["KeyW"]){ player_move.x+=player_direction.x; if(player_fly){ player_move.y+=player_direction.y; } player_move.z+=player_direction.z; }
if(key_status["KeyS"]){ player_move.x-=player_direction.x; if(player_fly){ player_move.y-=player_direction.y; } player_move.z-=player_direction.z; }
if(key_status["KeyA"]){
if(player_on_floor){ hand_sway_strafe_rotation_z+=0.002; camera_strafe_rotation_z+=0.001; }
player_move.x-=Math.cos(player_angle.x*degrees_to_radian); player_move.z+=Math.sin(player_angle.x*degrees_to_radian);
}
if(key_status["KeyD"]){
if(player_on_floor){ hand_sway_strafe_rotation_z-=0.002; camera_strafe_rotation_z-=0.001; }
player_move.x+=Math.cos(player_angle.x*degrees_to_radian); player_move.z-=Math.sin(player_angle.x*degrees_to_radian);
}


if(key_status["ShiftLeft"] && key_status["KeyW"] && player_on_floor){


player_speed_floor+=0.4;
head_bobbing_run_multyplier+=head_bobbing_run_multyplier_add;


hand_run_enabled=true;
if(hand_aim_enabled){
hand_aim_enabled=false;
sounds_play(null,"gun_aim_out",false,false,1,0,1,false,"","");
}


if(click_left_down){
key_status["ShiftLeft"]=false;
}


}
else{
player_speed_floor-=0.4;
head_bobbing_run_multyplier-=head_bobbing_run_multyplier_add;
hand_run_enabled=false;
}


player_speed_floor=Math.min(Math.max(player_speed_floor,player_speed_go),player_speed_run);
head_bobbing_run_multyplier=Math.min(head_bobbing_run_multyplier_max,Math.max(1,head_bobbing_run_multyplier));


if(key_status["KeyQ"] && !key_status["ShiftLeft"]){
player_peek_value-=player_peek_in_speed;
player_peek_value=Math.min(Math.max(player_peek_value,-1),1);
}
else if(key_status["KeyE"] && !key_status["ShiftLeft"]){
player_peek_value+=player_peek_in_speed;
player_peek_value=Math.min(Math.max(player_peek_value,-1),1);
}
else{ player_peek_value+=-player_peek_value*player_peek_out_speed; }


if(key_status["KeyY"]){ sun_direction_upadte();	}


if(key_status["KeyR"] && action["gun_2_reload"].enabled==false){


if(hand_aim_enabled){ hand_aim_enabled=false; }


action["gun_2_reload"].enabled=true;
action["gun_2_reload"].time=0;
sounds_play(null,"gun_reload",false,false,1,0,1,false,"","");


spring_reload_impulse_z=0.02;
setTimeout(()=>{ spring_reload_impulse_z=0.04; },1300);
setTimeout(()=>{ spring_reload_impulse_z=0.06; },2200);


spring_reload_impulse_x=0.01;
spring_reload_impulse_y=0.01;
setTimeout(()=>{ spring_reload_impulse_x=0.02; spring_reload_impulse_y=0.02; },1300);
setTimeout(()=>{ spring_reload_impulse_x=0.02; spring_reload_impulse_y=0.02; },2200);


}


if(click_left_down && !hand_run_enabled && hand_run_intensity==0){
	
	
if(action["gun_2_reload"].enabled==false){
	
	
if(light["weapon"].intensity==0){
action["gun_2_shoot"].enabled=true;
action["gun_2_shoot"].time=0;
gun_impulse=0.03;
impulse_x=0.05;
impulse_y=(Math.random()-0.5)*0.06;
sounds_play(null,"gun_shoot",false,false,1,0,1,false,"","");
light["weapon"].intensity=5;
setTimeout(()=>{ light["weapon"].intensity=0; },50);


mesh["gun_muzzle_origin"].getWorldPosition(vector3);
mesh["gun_muzzle_origin"].getWorldDirection(vector3_2);
let name=Date.now();


let scale=0.05+Math.random()*0.05;
sprite["weapon_smoke"][name+"_1"]={
fade_speed:0.15,
scale_speed:0.0025,
offset:[vector3.x,vector3.y,vector3.z],scale:[scale,scale],quaternion:[0,0,0,5],rotation:[0.001,Math.random()*3.14],color:[0.7,0.7,1,0.3],blend:1,soft:0,frame:atlas["smoke_fg"][0],texture:atlas["smoke_fg"][1]
};


scale=0.05+Math.random()*0.05;
sprite["weapon_smoke"][name+"_2"]={
fade_speed:0.2,
scale_speed:0.0025,
offset:[vector3.x+vector3_2.x*0.1,vector3.y+vector3_2.y*0.1,vector3.z+vector3_2.z*0.1],scale:[scale,scale],quaternion:[0,0,0,5],rotation:[-0.0015,Math.random()*3.14],color:[0.7,0.7,1,0.3],blend:1,soft:0,frame:atlas["smoke_fg"][0],texture:atlas["smoke_fg"][1]
};


scale=0.08+Math.random()*0.05;
sprite["weapon_muzzle_flash"][name+"_1"]={
time:0,object:mesh["gun_muzzle_origin"],
offset:[0,0,0],scale:[scale,scale],quaternion:[0,0,0,5],rotation:[0,Math.random()*3.14],color:[1,1,1,1],blend:0,soft:0,frame:atlas["pistol_muzzle_flash"][0],texture:atlas["pistol_muzzle_flash"][1]
};


let max_sparks=5+Math.random()*4;
let spread=0.2; // ОТ 1 ДО 2. 1.00 ЭТО 180 ГРАДУСОВ (ПОЛУСФЕРА), 2 ЭТО 360 ГРУДСУОВ (СФЕРА)


for(let n=0;n<max_sparks;n++){


// СЛУЧАЙНЫЙ СФЕРИЧЕСКИЙ ВЕКТОР
const theta=random()*PI*2;
const u=random()*2-1;
const c=sqrt(1-u*u);
let vx=c*cos(theta);
let vy=u;
let vz=c*sin(theta);


// СКЛАДЫВАЕМ
let sx=vector3_2.x+vx*spread;
let sy=vector3_2.y+vy*spread;
let sz=vector3_2.z+vz*spread;


// НОРМАЛИЗУЕМ
let scalar=1/sqrt(sx*sx+sy*sy+sz*sz);
sx*=scalar;
sy*=scalar;
sz*=scalar;


if(abs(sx)==0 && abs(sy) && abs(sz)){
sx=vx;
sy=vy;
sz=vz;
}	


sprite["muzzle_spark"][name+"_"+n]={
time:0.1+Math.random()*0.2,
speed:0.3+Math.random()*0.2,
offset:[vector3.x,vector3.y,vector3.z],scale:[0.02,0.05+random()*0.1],quaternion:[sx,sy,sz,8],rotation:[0,0],color:[1,0.3+random()*0.7,0,1],blend:0,soft:0,frame:atlas["tracer"][0],texture:atlas["tracer"][1]
};


}


raycaster.ray.direction.set(camera_direction_x,camera_direction_y,camera_direction_z);
raycaster.ray.origin.copy(camera_position);
let hits_a=raycaster.intersectObjects([mesh["soldier_attack_1"],mesh["soldier_attack_2"]],true);
if(hits_a.length>0){
let scale=0.1+Math.random()*0.3;
sprite["blood"][name+"_1"]={
type:1,time:10,power:0.05+Math.random()*0.2,nx:hits_a[0].normal.x,ny:hits_a[0].normal.y,nz:hits_a[0].normal.z,	
offset:[hits_a[0].point.x,hits_a[0].point.y,hits_a[0].point.z],scale:[scale,scale],quaternion:[0,0,0,5],rotation:[0,0],color:[1,1,1,1],blend:1,soft:0,frame:atlas["blood_3"][0],texture:atlas["blood_3"][1]
};
}


}


}


click_left_down=false;
click_left_up=false;

	
}


if(click_right_down && (action["gun_2_reload"].enabled==false || key_status["ShiftLeft"])){
	

if(hand_aim_enabled){
hand_aim_enabled=false;
sounds_play(null,"gun_aim_out",false,false,1,0,1,false,"","");
}
else{
hand_aim_enabled=true;
sounds_play(null,"gun_aim_in",false,false,1,0,1,false,"","");
}	
click_right_down=false;
click_right_up=false;


key_status["ShiftLeft"]=false;

	
}


if(key_up["KeyF"]){ sounds_play(null,"voice_drop_your_weapon",false,false,1,0,1,false,"",""); }
if(key_up["KeyG"]){ if(player_noclip){ player_noclip=false; }else{ player_noclip=true; } console.log("FREE: "+player_noclip); }
if(key_up["KeyH"]){ if(player_fly){ player_fly=false; }else{ player_fly=true; } console.log("FLY: "+player_fly); }
key_up=[];


if(player_fly){ speed_delta=delta_time*player_speed_floor; }
	
	
player_move.normalize();
player_move.x*=speed_delta;
player_move.y*=speed_delta;
player_move.z*=speed_delta;
player_velocity.add(player_move);


player_friction_now=1;


if(player_on_floor){
	
	
if(key_status["Space"]){
player_velocity.y=player_speed_jump;
player_landed=false;
sounds_play(null,"jump",false,false,1,0,1,false,"","");	
}


if(player_move.x==0 && player_move.z==0){
player_friction_now=player_friction;
}

	
}


}


// ____________________ ПОВОРОТ  ____________________


function player_rotate(event){


if(pause==1){ return; }


player_angle.y+=event.movementY*player_look_sensitivity;
player_angle.x-=event.movementX*player_look_sensitivity;


hand_sway_data_update(event.movementX,event.movementY);


}


function player_rotate_limit(){
	
	
player_angle.y=Math.min(player_angle_y_max,Math.max(player_angle_y_min,player_angle.y));


if(player_angle.x>360){ player_angle.x-=360; }
if(player_angle.x<0){ player_angle.x+=360; }


}
	

function player_direction_update(){


player_direction.x=Math.cos((-player_angle.x-90)*degrees_to_radian)*(Math.sin(player_angle.y*degrees_to_radian));
player_direction.y=Math.cos(player_angle.y*degrees_to_radian);
player_direction.z=Math.sin((-player_angle.x-90)*degrees_to_radian)*(Math.sin(player_angle.y*degrees_to_radian));
player_head.lookAt(player.position.x+player_direction.x+player_head.position.x,player.position.y+player_eyes+player_direction.y+player_head.position.y,player.position.z+player_direction.z+player_head.position.z);


player_head.position.x=Math.cos(-player_angle.x*degrees_to_radian)*player_peek_value*player_peek_head_position_x;
player_head.position.z=Math.sin(-player_angle.x*degrees_to_radian)*player_peek_value*player_peek_head_position_x;
player_head.position.y=Math.abs(player_peek_value)*player_peek_head_position_y;


}


// ____________________ ШАГИ  ____________________


function player_footsteps(){
	

if(player_on_floor && (player_move.x!=0 || player_move.z!=0)){
player_steps_time+=delta;
let range=player_speed_run-player_speed_go;
let foot_time=player_speed_floor-player_speed_go;
foot_time/=range;
foot_time=1.0-foot_time;
if(player_steps_time>0.3+0.1*foot_time){
player_steps_time=0;
let player_footstep_now=player_footstep_last;
while(player_footstep_now==player_footstep_last){
player_footstep_now=Math.floor(Math.random()*4)+1;	
}
player_footstep_last=player_footstep_now;
sounds_play(null,"footstep_"+player_footstep_now,false,false,1,0,1,false,"","");	
}
}
else{
player_steps_time=0;
}	
	
	
}

