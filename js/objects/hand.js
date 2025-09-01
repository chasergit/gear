/*


120825 Сейчас сделано:
1. Если стоит в прицеле, то при перезарядке выходит из прицела и не может стрелять.
2. Если стоит в прицеле, то при беге выходит из прицела.
3. При перезарядке не может стрелять, но может бежать перезаряжаясь.
4. Если перезаряжаться и нажать стрельбу, то в конце перезарядки не выстрелит.
5. При беге, если нажать перезарядку, то будет бежать и перезаряжаться.
6. При беге, если нажать выстрел, то остановится и не сможет снова бежать, пока не закончится анимация бега и не выстрелит.
7. Если не отпуская бег перейти в прицел, то перейдёт в прицел, и если потом выйти из него, то не продолжает бежать. 
8. При беге анимация смещения оружия влево медленная, а возврат на место быстрый, чтобы можно было сразу стрельнуть.
9. Выглядывать из-за угла нельзя при беге

При выстреле без прицела, есть анимация и дополнительная отдача оружия вверх.
При выстреле в прицеле, уменьшаем почти до нуля анимацию и дополнительную отдачу оружия вверх.
При выстреле в прицеле ещё увод ствола вверх убирается, который увеличивается если долго стрелять. иначе мушка выше чем центр луча для выстрела и закрывает обзор.


Колыхание головы при дыхании без прицела и в прицеле


let configOgro={
baseUrl:"models/women/",
body:"tris.md2",
skins:["0.png","1.png","2.png","3.png","4.png","5.png","6.png"],
weapons:[["weapon.md2","weapon.png"]],
animations:{
move:"run",
idle:"stand",
jump:"jump",
attack:"attack",
crouchMove:"cwalk",
crouchIdle:"cstand",
crouchAttach:"crattack"
},
walkSpeed:350,
crouchSpeed:175
};


*/


let hand_item=[];
hand_item["gun"]={sway:0.04,go:0.5};
hand_item["riffle"]={sway:0.04,go:0.5};
hand_item["rpg"]={sway:0.04,go:0.5};


let hand_position;
let hand_rotation;


// ____________________ КАЧАНИЕ ГОЛОВЫ ПРИ ХОДЬБЕ И БЕГЕ____________________


let head_bobbing_run_multyplier_add=0.01; // КАК БЫСТРО ПРИ БЕГЕ НАЧИНАТЬ СИЛЬНЕЕ КАЧАТЬ ГОЛОВОЙ
let head_bobbing_run_multyplier_max=1.3; // СКОРОСТЬ КОЛЫХАНИЯ ПРИ БЕГЕ
let head_bobbing_multyplier=1.0; // СИЛА КОЛЫХАНИЯ ОТ 1


let head_bobbing_run_multyplier=1;
let head_bobbing_total=0;
let head_bobbing_time=0;
let head_bobbing_intensity=0;


// ____________________ КАЧАНИЕ ГОЛОВЫ ПРИ ДЫХАНИИ БЕЗ ПРИЦЕЛА ____________________


let head_breathing_rotation_max_x=0.002; // ПОВОРОТ ПО X
let head_breathing_rotation_max_y=0.004; // ПОВОРОТ ПО Y
let head_breathing_frequency_x=0.0009; // ЧАСТОТА ПОВОРОТА ПО X
let head_breathing_frequency_y=0.0018; // ЧАСТОТА ПОВОРОТА ПО Y
let head_breathing_default_intensity=1;
let head_breathing_rotation_x=0;
let head_breathing_rotation_y=0;


// ____________________ КАЧАНИЕ ГОЛОВЫ ПРИ ДЫХАНИИ В ПРИЦЕЛЕ ____________________


let head_breathing_aim_intensity=0.4;
let head_breathing_speed_intensity=5;
let head_breathing_to_intensity=1;
let head_breathing_intensity=0;


// ____________________ ПОЛОЖЕНИЕ БЕЗ ПРИЦЕЛИВАНИЯ ____________________


let hand_offset_position_x=0.065; 
let hand_offset_position_y=-0.06;
let hand_offset_position_z=0.04;
let hand_offset_rotation_x=0.04;
let hand_offset_rotation_y=0.05;


// ____________________ КАЧАНИЕ ВОСЬМЁРКОЙ В ПОКОЕ ____________________


let hand_idle_max_x=0.001; // СМЕЩЕНИЕ ПО X
let hand_idle_max_y=0.002; // СМЕЩЕНИЕ ПО Y
let hand_idle_frequency_x=0.0012; // ЧАСТОТА СМЕЩЕНИЯ ПО X
let hand_idle_frequency_y=0.0024; // ЧАСТОТА СМЕЩЕНИЯ ПО Y


// ____________________ ПРИЦЕЛИВАНИЕ ____________________


window.hand_aim_enabled=false;
window.hand_aim_speed_in=0.1;
window.hand_aim_speed_out=0.1;
window.hand_aim_idle=0.3;
window.hand_aim_sway_go=0.3;
window.hand_aim_sway_turn=0.5;
window.hand_aim_position_x=0;
window.hand_aim_position_y=-0.015;
window.hand_aim_position_z=-0.05;
window.hand_aim_zoom=1.3;
window.hand_aim_intensity=0;
window.hand_aim_inverted_intensity=1;


// ____________________ БЕГ ____________________


window.hand_run_enabled=false;
window.hand_run_speed_in=0.05;
window.hand_run_speed_out=0.12;
window.hand_run_position_x=0.15;
window.hand_run_position_y=-0.05;
window.hand_run_position_z=0.0;
window.hand_run_rotation_x=-0.1;
window.hand_run_rotation_y=0.8;
window.hand_run_rotation_z=0.2;
window.hand_run_intensity=0;
window.hand_run_inverted_intensity=1;


// ____________________ НАКЛОН ПРИ ПОВОРОТЕ ____________________


let hand_sway_turn_rotation_y_range=0.05; // ПОВОРОТ ГОРИЗОНТАЛЬНЫЙ ИНТЕРВАЛ
let hand_sway_turn_rotation_x_range=0.05; // ПОВОРОТ ВЕРТИКАЛЬНЫЙ ИНТЕРВАЛ
let hand_sway_turn_rotation_z_range=0.2; // ПОВОРОТ ДИАГОНАЛЬНЫЙ ИНТЕРВАЛ


// ____________________ КОЛЫХАНИЕ ПРИ ХОДЬБЕ ____________________


let hand_sway_go_move_x=0.01;
let hand_sway_go_move_y=0.005;
let hand_sway_go_frequency_x=0.1*1.3*62;
let hand_sway_go_frequency_y=0.2*1.3*62;
let hand_sway_go_move_z=0.01; // НА СКОЛЬКО СМЕЩАТЬ ПО Z


let hand_sway_strafe_rotation_z=0; // ПОВОРОТ ОРУЖИЯ ПРИ ПЕРЕДВИЖЕНИИ БОКОМ
let camera_strafe_rotation_z=0; // ПОВОРОТ КАМЕРЫ ПРИ ПЕРЕДВИЖЕНИИ БОКОМ
let hand_idle_position_x=0;
let hand_idle_position_y=0;
let hand_sway_go_position_x=0;
let hand_sway_go_position_y=0;
let hand_sway_go_position_z=0;
let hand_sway_turn_rotation_x=0;
let hand_sway_turn_rotation_y=0;
let hand_sway_turn_rotation_z=0;


let hand_go_time=0;
let hand_go_intensity=0;
let hand_go_inverted_intensity=0;
let hand_sway_intensity=0;
let hand_sway_inverted_intensity=0;


let gun_impulse=0;
let gun_recoil=0;


let force_x=0;
let force_y=0;
let impulse_x=0;
let impulse_y=0;
let velocity_x=0;
let velocity_y=0;
let spring=0.05; // УПРУГОСТЬ
let damping=0.87 // ЗАТУХАНИЕ


let test_x=0;
let test_y=0;


let spring_reload_z=0;
let spring_reload_force_z=0;
let spring_reload_impulse_z=0;
let spring_reload_velocity_z=0;
let spring_reload_spring_z=0.1; // УПРУГОСТЬ
let spring_reload_damping_z=0.85; // ЗАТУХАНИЕ


let spring_reload_x=0;
let spring_reload_y=0;
let spring_reload_force_x=0;
let spring_reload_force_y=0;
let spring_reload_impulse_x=0;
let spring_reload_impulse_y=0;
let spring_reload_velocity_x=0;
let spring_reload_velocity_y=0;
let spring_reload_spring_xy=0.02; // УПРУГОСТЬ
let spring_reload_damping_xy=0.9; // ЗАТУХАНИЕ


function weapon_sway_set(){
	
	
mesh["hand"]=new THREE.Object3D();
camera.add(mesh["hand"]);
scene_2.children.push(mesh["hand"]);


// ОТОБРАЖЕНИЕ ВТОРЫМ СЛОЕМ
/*
camera.remove(mesh["hand"]);
mesh["hand"].parent=camera;
mesh["hand"].children.push(light["sun"],light["ambient"]);
render_pass_2.scene=mesh["hand"];
*/

mesh["weapon_debug"]=new THREE.Mesh(new THREE.BoxGeometry(0.01,0.02,0.2),new THREE.MeshStandardMaterial({
color:0xff0000
}));
mesh["weapon_debug"].geometry.translate(0,0.0,-0.1);
mesh["weapon_debug"].position.set(0.0,0,-0.25);
//mesh["hand"].add(mesh["weapon_debug"]);


hand_position=mesh["hand"].position;
hand_rotation=mesh["hand"].rotation;


}


function player_gun_set(){
	

light["weapon"]=new THREE.PointLight(0xffc000,0.0,3.0,1.0);
light["weapon"].position.set(2,2,12);
helper["gun_light"]=new THREE.PointLightHelper(light["weapon"],2.0);
scene.add(helper["gun_light"]);


mesh["gun_muzzle_origin"]=new THREE.Mesh(new THREE.SphereGeometry(2.0,32,32),new THREE.MeshPhongMaterial({color:0xff0000,side:2}));
mesh["gun_muzzle_origin"].position.set(0,8,27);
mesh["gun_2"].traverse(function(child){
if(child.name=="Talon"){
//child.add(mesh["gun_muzzle_origin"]);
mesh["gun_muzzle_origin"].parent=child;
}
});


mesh["gun_2"].position.set(0.0,-0.05,-0.28);	
mesh["gun_2"].scale.set(0.016,0.016,0.016);
mesh["gun_2"].rotation.y=PI;
mesh["gun_2"].add(light["weapon"]);
mesh["hand"].add(mesh["gun_2"]);


}


function hand_sway_data_update(x,y){


hand_sway_intensity+=0.1*hand_go_inverted_intensity;


hand_sway_turn_rotation_x+=y*0.0003;
hand_sway_turn_rotation_y+=x*0.0003;
hand_sway_turn_rotation_z-=x*0.0003;


}


let fixed_delta=0.01666;


function player_animations_update(){


// КАЧАНИЕ ГОЛОВЫ ПРИ ДЫХАНИИ
head_breathing_rotation_x=Math.sin(time*head_breathing_frequency_x)*head_breathing_rotation_max_x*head_breathing_intensity;
head_breathing_rotation_y=Math.sin(time*head_breathing_frequency_y)*head_breathing_rotation_max_y*head_breathing_intensity;


if(player_velocity.length()>0.01){
head_bobbing_time+=fixed_delta*head_bobbing_run_multyplier;
hand_go_time+=fixed_delta;
hand_go_intensity+=0.07;
head_bobbing_intensity+=0.2*player_velocity.length();
}
else{
hand_go_time+=fixed_delta;
head_bobbing_time=0;
}


if(hand_go_intensity==0){
hand_go_time=0;	
}


hand_go_intensity-=0.03;
hand_go_intensity=Math.min(Math.max(hand_go_intensity,0),1);
hand_go_inverted_intensity=1-hand_go_intensity;
hand_sway_intensity-=0.05;
hand_sway_intensity=Math.min(Math.max(hand_sway_intensity,0),1);
hand_sway_inverted_intensity=1-hand_sway_intensity;


head_bobbing_intensity-=0.1;
head_bobbing_intensity=Math.min(Math.max(head_bobbing_intensity,0),1);
head_bobbing_total=head_bobbing_intensity*head_bobbing_run_multyplier*head_bobbing_multyplier;


hand_sway_go_position_x=Math.sin(hand_go_time*hand_sway_go_frequency_x)*hand_sway_go_move_x*hand_go_intensity*hand_sway_inverted_intensity;
hand_sway_go_position_y=-Math.cos(hand_go_time*hand_sway_go_frequency_y)*hand_sway_go_move_y*hand_go_intensity*hand_sway_inverted_intensity;
hand_sway_go_position_z=hand_sway_go_move_z*hand_go_intensity;


// КАЧАНИЕ ВОСЬМЁРКОЙ В ПОКОЕ
hand_idle_position_x=Math.sin(time*hand_idle_frequency_x)*hand_idle_max_x*hand_go_inverted_intensity*hand_sway_inverted_intensity;
hand_idle_position_y=Math.sin(time*hand_idle_frequency_y)*hand_idle_max_y*hand_go_inverted_intensity*hand_sway_inverted_intensity;


// ВОЗВРАЩЕНИЕ ПОВОРОТА
hand_sway_turn_rotation_x=Math.min(Math.max(hand_sway_turn_rotation_x,-hand_sway_turn_rotation_x_range),hand_sway_turn_rotation_x_range);
hand_sway_turn_rotation_x-=hand_sway_turn_rotation_x*10*fixed_delta*(Math.abs(hand_sway_turn_rotation_x)/hand_sway_turn_rotation_x_range);
hand_sway_turn_rotation_y=Math.min(Math.max(hand_sway_turn_rotation_y,-hand_sway_turn_rotation_y_range),hand_sway_turn_rotation_y_range);
hand_sway_turn_rotation_y-=hand_sway_turn_rotation_y*10*fixed_delta*(Math.abs(hand_sway_turn_rotation_y)/hand_sway_turn_rotation_y_range);
hand_sway_turn_rotation_z=Math.min(Math.max(hand_sway_turn_rotation_z,-hand_sway_turn_rotation_z_range),hand_sway_turn_rotation_z_range);
hand_sway_turn_rotation_z-=hand_sway_turn_rotation_z*10*fixed_delta;


// ВЫСТРЕЛ


gun_impulse-=0.0025;
if(gun_impulse<0){ gun_impulse=0; }
//hand_sway_go_position_z+=gun_impulse*0.6;
//hand_sway_go_position_z-=0.01;
//if(hand_sway_go_position_z<-0.25){ hand_sway_go_position_z=-0.25; }
//if(hand_sway_go_position_z>-0.20){ hand_sway_go_position_z=-0.20; }
//hand_sway_turn_rotation_x+=gun_impulse*5;
//if(gun_recoil<5){
//player_angle.y-=gun_impulse*5*(1-gun_recoil/5);
//player_angle.x-=gun_impulse*1.0*(1-gun_recoil/5);
//}
player_angle.y-=gun_impulse*5;
player_angle.x-=gun_impulse*1;
//if(gun_recoil<5){
//gun_recoil+=gun_impulse*5*(1-gun_recoil/5);
//}
gun_recoil+=gun_impulse*5;
if(gun_impulse==0 && gun_recoil>0){
gun_recoil-=0.2;
player_angle.y+=0.2;	
player_angle.x+=0.04;	
}
camera.position.z=-gun_impulse*1.0;


test_x+=velocity_x;
test_y+=velocity_y;
force_x=(0-test_x)*spring;
force_y=(0-test_y)*spring;
velocity_x+=(force_x+impulse_x)*(1-Math.min(Math.abs(velocity_x)/5),1.0);
velocity_x*=damping;
velocity_y+=(force_y+impulse_y)*(1-Math.min(Math.abs(velocity_y)/5),1.0);
velocity_y*=damping;
impulse_x=0;
impulse_y=0;


spring_reload_z+=spring_reload_velocity_z;
spring_reload_force_z=-spring_reload_z*spring_reload_spring_z;
spring_reload_velocity_z+=spring_reload_force_z+spring_reload_impulse_z;
spring_reload_velocity_z*=spring_reload_damping_z;
spring_reload_impulse_z=0;


spring_reload_x+=spring_reload_velocity_x;
spring_reload_y+=spring_reload_velocity_y;
spring_reload_force_x=-spring_reload_x*spring_reload_spring_xy;
spring_reload_force_y=-spring_reload_y*spring_reload_spring_xy;
spring_reload_velocity_x+=spring_reload_force_x+spring_reload_impulse_x;
spring_reload_velocity_x*=spring_reload_damping_xy;
spring_reload_velocity_y+=spring_reload_force_y+spring_reload_impulse_y;
spring_reload_velocity_y*=spring_reload_damping_xy;
spring_reload_impulse_x=0;
spring_reload_impulse_y=0;


hand_sway_strafe_rotation_z+=-hand_sway_strafe_rotation_z*0.06;
hand_sway_strafe_rotation_z=Math.min(Math.max(hand_sway_strafe_rotation_z,-0.1),0.1);


camera_strafe_rotation_z+=-camera_strafe_rotation_z*0.08;
camera_strafe_rotation_z=Math.min(Math.max(camera_strafe_rotation_z,-0.4),0.4);


//hand_position.x=(hand_offset_position_x+hand_sway_go_position_x+hand_idle_position_x)*hand_aim_inverted_intensity+hand_aim_position_x*hand_aim_intensity;


hand_position.x=hand_offset_position_x*hand_aim_inverted_intensity*hand_run_inverted_intensity+hand_aim_position_x*hand_aim_intensity;
hand_position.x+=hand_sway_go_position_x*Math.max(hand_aim_sway_go,hand_aim_inverted_intensity);
hand_position.x+=hand_idle_position_x*Math.max(hand_aim_idle,hand_aim_inverted_intensity);
hand_position.x+=hand_run_position_x*hand_run_intensity;


//hand_position.y=(hand_offset_position_y+hand_sway_go_position_y+hand_idle_position_y)*hand_aim_inverted_intensity+hand_aim_position_y*hand_aim_intensity;


hand_position.y=hand_offset_position_y*hand_aim_inverted_intensity*hand_run_inverted_intensity+hand_aim_position_y*hand_aim_intensity;
hand_position.y+=hand_sway_go_position_y*Math.max(hand_aim_sway_go,hand_aim_inverted_intensity);
hand_position.y+=hand_idle_position_y*Math.max(hand_aim_idle,hand_aim_inverted_intensity);
hand_position.y+=hand_run_position_y*hand_run_intensity;


hand_position.z=(hand_offset_position_z+hand_sway_go_position_z)*hand_aim_inverted_intensity*hand_run_inverted_intensity+hand_aim_position_z*hand_aim_intensity;
hand_position.z+=hand_run_position_z*hand_run_intensity;


//hand_rotation.x=hand_sway_turn_rotation_x+velocity_x+hand_offset_rotation_x;
hand_rotation.x=hand_offset_rotation_x*hand_aim_inverted_intensity*hand_run_inverted_intensity;
hand_rotation.x+=hand_sway_turn_rotation_x*Math.max(hand_aim_sway_turn,hand_aim_inverted_intensity);
hand_rotation.x+=velocity_x;
hand_rotation.x+=hand_run_rotation_x*hand_run_intensity;


//hand_rotation.y=hand_sway_turn_rotation_y+velocity_y+hand_offset_rotation_y;
hand_rotation.y=hand_offset_rotation_y*hand_aim_inverted_intensity*hand_run_inverted_intensity;
hand_rotation.y+=hand_sway_turn_rotation_y*Math.max(hand_aim_sway_turn,hand_aim_inverted_intensity);
hand_rotation.y+=velocity_y;
hand_rotation.y+=hand_run_rotation_y*hand_run_intensity;


//hand_rotation.z=hand_sway_turn_rotation_z+hand_sway_strafe_rotation_z+-player_peek_value*player_peek_hand_rotation_z;
hand_rotation.z=hand_sway_turn_rotation_z*Math.max(hand_aim_sway_turn,hand_aim_inverted_intensity);
hand_rotation.z+=hand_sway_strafe_rotation_z+-player_peek_value*player_peek_hand_rotation_z;
hand_rotation.z+=hand_run_rotation_z*hand_run_intensity;


camera.rotation.z=-PI+velocity_x*0.3-spring_reload_velocity_z+camera_strafe_rotation_z-Math.sin(head_bobbing_time*7.5)*0.004*head_bobbing_total-player_peek_value*player_peek_camera_rotation_z;
camera.rotation.x=-PI-spring_reload_velocity_x-Math.cos(head_bobbing_time*15)*0.002*head_bobbing_total+head_breathing_rotation_y;
camera.rotation.y=spring_reload_velocity_y+Math.sin(head_bobbing_time*7.5)*0.004*head_bobbing_total+head_breathing_rotation_x;
camera.position.z=velocity_x*1.0;


camera.zoom=1*hand_aim_inverted_intensity+hand_aim_zoom*hand_aim_intensity;


if(hand_aim_enabled){ hand_aim_intensity+=hand_aim_speed_in; }
else{ hand_aim_intensity-=hand_aim_speed_out; }
hand_aim_intensity=Math.min(Math.max(hand_aim_intensity,0),1);
hand_aim_inverted_intensity=1-hand_aim_intensity;


if(hand_run_enabled){ hand_run_intensity+=hand_run_speed_in; }
else{ hand_run_intensity-=hand_run_speed_out; }
hand_run_intensity=Math.min(Math.max(hand_run_intensity,0),1);
hand_run_inverted_intensity=1-hand_run_intensity;


head_breathing_to_intensity=head_breathing_default_intensity;
if(hand_aim_enabled){ head_breathing_to_intensity=head_breathing_aim_intensity; }
head_breathing_intensity+=(head_breathing_to_intensity-head_breathing_intensity)*head_breathing_speed_intensity*fixed_delta;
head_breathing_intensity=Math.min(1,Math.max(0,head_breathing_intensity));
//console.log(head_breathing_intensity);


player_angle.y-=velocity_x*10.0;	
player_angle.x+=velocity_y*10.0;	


mat["crosshair"].uniforms.scale.value=50+gun_impulse*4000;


}