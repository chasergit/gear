/*
120625 колыхание оружия https://editor.me/raznoe/0_fps_all/fps_platform/index.html
130325 для перехода с ходьбы на бег используем тот же код просто увеличивая силу смещения и может уменьшая скорость колыхания головы т.е.:
walk_bob=1.2;
run_bob=3.8;
walk_bob_frequency=0.1;
run_bob_frequency=0.3;
и также колыхание оружия от минимума до максимума
130325 Надо ли наклоны Q, E
110325 000_spring.html
130125 Как делается отдача прицел https://www.youtube.com/watch?v=raslm-k5l74
050125 https://js.otrisovano.ru/android/chapter08/
211224
000_FPSAnimator_Playable здеь при выстреле камера дергается приятно наискось как в калибре
000_spring.html тряска можно и для 3d видимо
warface_videos папка
https://www.youtube.com/watch?v=JrQicb3fwiA&ab_channel=JungaBoon
https://github.com/jungaboon/Tutorial_Scripts/blob/main/FPS%20Weapon%20Sway%20and%20Movement/player_controller.gd
*/

/*
В James Bond при ходьбе влево-вправо наклон головы слегка. При ходьбе вперёд покачивание оружия. при попадании по игроку шатание. при выстреле отдача.
В Payday тоже посмотреть

не забываем домножать на delta, а то будет как-будто покадро показывать без пропуска. типа прошло 2 секунды, а показывает второй кадр вместо 200 кадра
в дефолтном качании оружия. надо в основном повороты, а не перемещение. добавить повороты, а перемещение уменьшить
при движении вперёд, оружие немного назад перемещать
при ходьбе оружие меньше колыхается
оружие направить в центр экрана
при приземлении кнечно тоже head bobbing как в https://www.youtube.com/watch?v=WF7d21zOD0M
тест. не отпуская стрельбу, войти в прицел. в играх продолжается стрельба обычно
в прицеле точность выше, а значит текстура прицела меньше
*/
/*
let mouseX = (weapon_sway_mouse.x - 0.5) * weapon_sway_sensitivity; // Assume mouse input ranges from -0.5 to 0.5
let mouseY = (weapon_sway_mouse.y - 0.5) * weapon_sway_sensitivity; // Assume mouse input ranges from -0.5 to 0.5
let rotationX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -mouseY);
let rotationY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), mouseX);
rotationX=Math.min(Math.max(rotationX,min),max);
let targetRotation = rotationX.multiply(rotationY);
mesh["weapon"].quaternion.slerp(targetRotation, weapon_sway_smooth * 0.001);
*/


let hand_item=[];
hand_item["gun"]=[0.04,0.5];
hand_item["riffle"]=[0.04,0.5];
hand_item["rpg"]=[0.04,0.5];


/* *********************************************************  */

/*
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ НАКЛОН ПРИ БЕГЕ НАКЛОН ПРИ БЕГЕ НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ
 НАКЛОН ПРИ БЕГЕ 
https://www.youtube.com/watch?v=kb41x0nNUCA

/* *********************************************************  */


// ____________________ КАЧАНИЕ ГОЛОВЫ ____________________


let head_bobbing_run_multyplier_add=0.01; // КАК БЫСТРО ПРИ БЕГЕ НАЧИНАТЬ СИЛЬНЕЕ КАЧАТЬ ГОЛОВОЙ
let head_bobbing_run_multyplier_max=1.3; // СКОРОСТЬ КОЛЫХАНИЯ ПРИ БЕГЕ
let head_bobbing_multyplier=1.0; // СИЛА КОЛЫХАНИЯ ОТ 1


let head_bobbing_run_multyplier=1;
let head_bobbing_total=0;
let head_bobbing_time=0;
let head_bobbing_intensity=0;


let hand_offset_x=0.055; // ПОЗИЦИЯ ПРЕДМЕТА X 
let hand_offset_y=-0.06; // ПОЗИЦИЯ ПРЕДМЕТА Y 
let hand_offset_z=0; // ПОЗИЦИЯ ПРЕДМЕТА Z 


// ДВИЖЕНИЕ ВОСЬМЁРКОЙ В ПОКОЕ
let hand_idle_max_x=0.001; // СМЕЩЕНИЕ ПО X
let hand_idle_max_y=0.002; // СМЕЩЕНИЕ ПО Y
let hand_idle_frequency_x=0.0012; // ЧАСТОТА СМЕЩЕНИЯ ПО X
let hand_idle_frequency_y=0.0024; // ЧАСТОТА СМЕЩЕНИЯ ПО Y


let weapon_sway_mouse={x:0,y:0};
let weapon_sway_smooth=20;
let weapon_sway_sensitivity=0.1;


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
let hand_sway_head_angle_rotation_z=0;


let hand_go_intensity=0;
let hand_go_time=0;
let hand_sway_intensity=0;


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


mesh["gun_2"].position.set(0.0,-0.05,-0.28);	
mesh["gun_2"].scale.set(0.016,0.016,0.016);
mesh["gun_2"].rotation.y=PI;
mesh["gun_2"].add(light["weapon"]);
mesh["hand"].add(mesh["gun_2"]);


}


let hand_position;
let hand_rotation;


function hand_sway_data_update(x,y){


hand_sway_intensity+=0.1*(1.0-hand_go_intensity);


hand_sway_turn_rotation_x+=y*0.0003;
hand_sway_turn_rotation_y+=x*0.0003;
hand_sway_turn_rotation_z-=x*0.0003;


}


function player_animations_update(){


if(player_velocity.length()>0.01){
head_bobbing_time+=delta*head_bobbing_run_multyplier;
hand_go_time+=delta;
hand_go_intensity+=0.07;
head_bobbing_intensity+=0.2*player_velocity.length();
}
else{
hand_go_time+=delta;
head_bobbing_time=0;
}


if(hand_go_intensity==0){
hand_go_time=0;	
}


hand_go_intensity-=0.03;
hand_go_intensity=Math.min(Math.max(hand_go_intensity,0),1);
hand_sway_intensity-=0.05;
hand_sway_intensity=Math.min(Math.max(hand_sway_intensity,0),1);


head_bobbing_intensity-=0.1;
head_bobbing_intensity=Math.min(Math.max(head_bobbing_intensity,0),1);
head_bobbing_total=head_bobbing_intensity*head_bobbing_run_multyplier*head_bobbing_multyplier;


hand_sway_go_position_x=Math.sin(hand_go_time*hand_sway_go_frequency_x)*hand_sway_go_move_x*hand_go_intensity*(1.0-hand_sway_intensity);
hand_sway_go_position_y=((-Math.cos(hand_go_time*hand_sway_go_frequency_y)*hand_sway_go_move_y)*hand_go_intensity)*(1.0-hand_sway_intensity);
hand_sway_go_position_z=hand_sway_go_move_z*hand_go_intensity;


// ДВИЖЕНИЕ ВОСЬМЁРКОЙ В ПОКОЕ
hand_idle_position_x=Math.sin(time*hand_idle_frequency_x)*hand_idle_max_x*(1.0-hand_go_intensity)*(1.0-hand_sway_intensity);
hand_idle_position_y=Math.sin(time*hand_idle_frequency_y)*hand_idle_max_y*(1.0-hand_go_intensity)*(1.0-hand_sway_intensity);


// ВОЗВРАЩЕНИЕ ПОВОРОТА
hand_sway_turn_rotation_x=Math.min(Math.max(hand_sway_turn_rotation_x,-hand_sway_turn_rotation_x_range),hand_sway_turn_rotation_x_range);
hand_sway_turn_rotation_x+=-hand_sway_turn_rotation_x*10*delta*(Math.abs(hand_sway_turn_rotation_x)/hand_sway_turn_rotation_x_range);
hand_sway_turn_rotation_y=Math.min(Math.max(hand_sway_turn_rotation_y,-hand_sway_turn_rotation_y_range),hand_sway_turn_rotation_y_range);
hand_sway_turn_rotation_y+=-hand_sway_turn_rotation_y*10*delta*(Math.abs(hand_sway_turn_rotation_y)/hand_sway_turn_rotation_y_range);
hand_sway_turn_rotation_z=Math.min(Math.max(hand_sway_turn_rotation_z,-hand_sway_turn_rotation_z_range),hand_sway_turn_rotation_z_range);
hand_sway_turn_rotation_z+=-hand_sway_turn_rotation_z*10*delta;


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
hand_sway_strafe_rotation_z=Math.min(Math.max(hand_sway_strafe_rotation_z,-0.2),0.2);


camera_strafe_rotation_z+=-camera_strafe_rotation_z*0.08;
camera_strafe_rotation_z=Math.min(Math.max(camera_strafe_rotation_z,-0.4),0.4);


hand_position.x=hand_offset_x+hand_sway_go_position_x+hand_idle_position_x;
hand_position.y=hand_offset_y+hand_sway_go_position_y+hand_idle_position_y;
hand_position.z=hand_sway_go_position_z;
hand_rotation.x=hand_sway_turn_rotation_x+velocity_x;
hand_rotation.y=hand_sway_turn_rotation_y+velocity_y;
hand_rotation.z=hand_sway_turn_rotation_z+hand_sway_strafe_rotation_z+hand_sway_head_angle_rotation_z;


camera.rotation.z=-PI+velocity_x*0.3-spring_reload_velocity_z+camera_strafe_rotation_z-Math.sin(head_bobbing_time*7.5)*0.004*head_bobbing_total;
camera.rotation.x=-PI-spring_reload_velocity_x+-Math.cos(head_bobbing_time*15)*0.002*head_bobbing_total;
camera.rotation.y=spring_reload_velocity_y+Math.sin(head_bobbing_time*7.5)*0.004*head_bobbing_total;


//player_angle.y-=velocity_x*10.0;	
//player_angle.x+=velocity_y*10.0;	


mat["crosshair"].uniforms.scale.value=50+gun_impulse*4000;


}