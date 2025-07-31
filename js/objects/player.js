let world_octree=new Octree();
let world_gravity=30;
let world_steps_per_frame=5;


let player=new THREE.Object3D();
player.position.set(23,2,0.2);
scene.add(player);


let player_direction={x:0,y:0,z:1};
let player_angle={y:90,x:180};
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


let player_head_angle=0;


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
if(player_on_floor){ hand_sway_strafe_rotation_z+=0.005; camera_strafe_rotation_z+=0.001; }
player_move.x-=Math.cos(player_angle.x*degrees_to_radian); player_move.z+=Math.sin(player_angle.x*degrees_to_radian);
}
if(key_status["KeyD"]){
if(player_on_floor){ hand_sway_strafe_rotation_z-=0.005; camera_strafe_rotation_z-=0.001; }
player_move.x+=Math.cos(player_angle.x*degrees_to_radian); player_move.z-=Math.sin(player_angle.x*degrees_to_radian);
}


if(key_status["ShiftLeft"] && key_status["KeyW"] && player_on_floor){ player_speed_floor+=0.4; head_bobbing_run_multyplier+=head_bobbing_run_multyplier_add; }
else{ player_speed_floor-=0.4; head_bobbing_run_multyplier-=head_bobbing_run_multyplier_add; }
player_speed_floor=Math.min(Math.max(player_speed_floor,player_speed_go),player_speed_run);
head_bobbing_run_multyplier=Math.min(head_bobbing_run_multyplier_max,Math.max(1,head_bobbing_run_multyplier));


if(key_status["KeyQ"]){
player_head_angle-=0.02;
player_head_angle=Math.min(Math.max(player_head_angle,-1),1);
hand_sway_head_angle_rotation_z+=0.005;
hand_sway_head_angle_rotation_z=Math.min(Math.max(hand_sway_head_angle_rotation_z,-0.2),0.2);
}
else if(key_status["KeyE"]){
player_head_angle+=0.02;
player_head_angle=Math.min(Math.max(player_head_angle,-1),1);
hand_sway_head_angle_rotation_z-=0.005;
hand_sway_head_angle_rotation_z=Math.min(Math.max(hand_sway_head_angle_rotation_z,-0.2),0.2);
}
else{ player_head_angle+=-player_head_angle*0.06; hand_sway_head_angle_rotation_z+=-hand_sway_head_angle_rotation_z*0.06; }


if(key_status["KeyY"]){ sun_direction_upadte();	}


if(key_status["KeyR"] && action["gun_2_reload"].enabled==false){
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


if(click_left_down && action["gun_2_reload"].enabled==false){
	
	
if(light["weapon"].intensity==0){
action["gun_2_shoot"].enabled=true;
action["gun_2_shoot"].time=0;
gun_impulse=0.03;
impulse_x=0.05;
impulse_y=(Math.random()-0.5)*0.06;
sounds_play(null,"gun_shoot",false,false,1,0,1,false,"","");
light["weapon"].intensity=5;
setTimeout(()=>{ light["weapon"].intensity=0; },50);
}
click_left_down=false;
click_left_up=false;

	
}


if(key_up["KeyF"]){ if(player_noclip){ player_noclip=false; }else{ player_noclip=true; } console.log("FREE: "+player_noclip); }
if(key_up["KeyG"]){ if(player_fly){ player_fly=false; }else{ player_fly=true; } console.log("FLY: "+player_fly); }
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
	
	
if(player_angle.y>170){ player_angle.y=170; }
if(10>player_angle.y){ player_angle.y=10; }


if(player_angle.x>360){ player_angle.x-=360; }
if(player_angle.x<0){ player_angle.x+=360; }


}
	

function player_direction_update(){


player_direction.x=Math.cos((-player_angle.x-90)*degrees_to_radian)*(Math.sin(player_angle.y*degrees_to_radian));
player_direction.y=Math.cos(player_angle.y*degrees_to_radian);
player_direction.z=Math.sin((-player_angle.x-90)*degrees_to_radian)*(Math.sin(player_angle.y*degrees_to_radian));
player_head.lookAt(player.position.x+player_direction.x+player_head.position.x,player.position.y+player_eyes+player_direction.y+player_head.position.y,player.position.z+player_direction.z+player_head.position.z);


player_head.position.x=Math.cos(-player_angle.x*degrees_to_radian)*player_head_angle*0.15;
player_head.position.z=Math.sin(-player_angle.x*degrees_to_radian)*player_head_angle*0.15;
player_head.position.y=-0.1*Math.abs(player_head_angle);


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

