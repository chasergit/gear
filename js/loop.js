function loop(){


requestAnimationFrame(loop); // СТАВИМ В НАЧАЛО, ЧТОБЫ СРАБОТАЛО ДАЖЕ ПРИ ОШИБКЕ


// РАСЧИТЫВАЕМ ПЕРЕД ТАЙМЕРАМИ, ЧТОБЫ НЕ УЧИТЫВАЛОСЬ В ОБЩЕМ ВРЕМЕНИ СТАТИСТИКИ
if(debug_mode){ stats.update(); }


debug_start("javascript");
debug_start("fps");


delta=clock.getDelta();
time=Date.now()-start_time;


debug_start("animations");


let max_mixers=mixers.length;


for(let n=0;n<max_mixers;n++){
mixers[n].update(delta);
}


debug_end("animations",max_mixers);


// ТРАВА
instances_section_pass_check();
// ТЕНИ ТРАВЫ
//shadow_ground_render();


debug_start("raycast_terrain_1");
raycaster.ray.direction.set(0,-1,0);
raycaster.ray.origin.y=500;
raycaster.ray.origin.copy(player.position);
let hits=raycaster.intersectObject(mesh["terrain"],false);
debug_end("raycast_terrain_1");
debug_start("raycast_terrain_2");
let result=intersection_ray_triangle(player.position,{x:0,y:-1,z:0},Infinity,[mesh["terrain"].geometry.attributes]);
debug_end("raycast_terrain_2");


/*
let min=9090;
for(let z=0;z<20;z++){
let started=performance.now();
for(let n=0;n<100;n++){
//let result=intersection_ray_triangle(player.position,{x:0,y:-1,z:0},Infinity,[mesh["terrain"].geometry.attributes]);
//4ms
let hits=ray_terrain.intersectObject(mesh["terrain"],false);
//52ms
}
let elap=performance.now()-started;
if(min>elap){ min=elap; }
}
console.log(min);
*/

player_rotate_limit();
player_direction_update();


debug_text.push(["position","<font></font>"+player.position.x.toFixed(2)+" "+(player.position.y+player_eyes).toFixed(2)+" "+player.position.z.toFixed(2)]);


const deltaTime=Math.min(0.05,delta)/world_steps_per_frame;
for(let i=0;i<world_steps_per_frame;i++){
player_controls(deltaTime);
player_update(deltaTime);
}


player_animations_update();


camera_data_update();


spread_update();


player_footsteps();


mesh["mbox"].position.x=30;
mesh["mbox"].position.y=1;
mesh["mbox"].position.z=70


mat["sprite"].uniforms.cameraDirection.value=camera_direction;


mat["sprite"].uniforms.time.value=time;
mat["sprite"].uniforms.cameraAngle.value=[-camera_angle_z*degrees_to_radian,-camera_angle_y*degrees_to_radian];


sprites_calculations();
debug_start("sprite");
sprites_update([sprite["wolf"],sprite["soul"],sprite["other"]],true,"sprite");
debug_end("sprite",mesh["sprite"].geometry._maxInstanceCount);
debug_start("sprite_far");
sprites_update([sprite["flare"],sprite["wall"],sprite["shine"],sprite["beam"]],false,"sprite_far");
debug_end("sprite_far",mesh["sprite_far"].geometry._maxInstanceCount);


let started=performance.now();
result=intersection_ray_sphere(camera_position,player_direction,50,[mesh["object_i_ray_sphere"]]);
let end=(performance.now()-started).toFixed(3);
if(result==0){ debug_text.push(["status_i_ray_sphere","<font></font> no"]); }
else{
mesh["status_i_ray_sphere"].position.set(camera_position.x+player_direction.x*result,camera_position.y+player_direction.y*result,camera_position.z+player_direction.z*result);
debug_text.push(["status_i_ray_sphere","<font></font>"+"Distance="+result.toFixed(2)+" x:"+(camera_position.x+player_direction.x*result).toFixed(2)+" y:"+(camera_position.y+player_direction.y*result).toFixed(2)+" z:"+(camera_position.z+player_direction.z*result).toFixed(2)]);
}


started=performance.now();
result=intersection_ray_AABB(camera_position,player_direction,50,[mesh["home"],mesh["home001"]]);
end=(performance.now()-started).toFixed(3);
if(result==0){ debug_text.push(["status_i_ray_AABB","<font></font> no"]); }
else{
mesh["status_i_ray_AABB"].position.set(camera_position.x+player_direction.x*result,camera_position.y+player_direction.y*result,camera_position.z+player_direction.z*result);
debug_text.push(["status_i_ray_AABB","<font></font>"+"Distance="+result.toFixed(2)+" x:"+(camera_position.x+player_direction.x*result).toFixed(2)+" y:"+(camera_position.y+player_direction.y*result).toFixed(2)+" z:"+(camera_position.z+player_direction.z*result).toFixed(2)])}


mesh["big_box_8"].rotation.z=-time*0.002;


mesh["big_box_6"].position.y=-1+Math.sin(time*0.004)*0.02;
mesh["big_box_6"].rotation.x=Math.sin(time*0.004)*0.01;
mesh["big_box_6"].rotation.z=Math.sin(time*0.003)*0.014;


mesh["jetski"].position.y=-1.3+Math.sin(time*0.004)*0.02;
mesh["jetski"].rotation.x=-1.57+Math.sin(time*0.004)*0.01;
mesh["jetski"].rotation.z=-2+Math.sin(time*0.003)*0.014;


mesh["gull_fly_1"].position.x=40+Math.sin(time*0.0005)*20;
mesh["gull_fly_1"].position.y=10+Math.sin(time*0.0002)*10;
mesh["gull_fly_1"].position.z=130+Math.cos(time*0.0005)*20;
mesh["gull_fly_1"].lookAt(40+Math.sin((time+1)*0.0005)*20,10+Math.sin((time+1)*0.0002)*10,130+Math.cos((time+1)*0.0005)*20);


mesh["gull_fly_2"].position.x=50+Math.sin(time*0.0004)*20;
mesh["gull_fly_2"].position.y=15+Math.sin(time*0.0002)*15;
mesh["gull_fly_2"].position.z=150+Math.cos(time*0.0004)*30;
mesh["gull_fly_2"].lookAt(50+Math.sin((time+1)*0.0004)*20,15+Math.sin((time+1)*0.0002)*15,150+Math.cos((time+1)*0.0004)*30);


sprite["other"][26].offset[2]=1.5+Math.sin(time*0.002)*15;
sprite["other"][29].offset[2]=6+Math.sin(time*0.01)*15;


sun_position_update();
mesh["hand"].updateMatrixWorld();
mesh["gun_2"].updateMatrixWorld();


gpu_stats_shader_name=""; // ДЛЯ ЗАМЕРА ВРЕМЕНИ ПОСТЭФФЕКТОВ
if(gpu_stats_shader_name==""){ gpu_stats.startQuery(); }


water_render();


debug_end("javascript");
debug_start("renderer");


renderer_stats_update(0);
renderer.info.reset();


/*
renderer.info.reset();
renderer.clear(); // ОЧИЩАЕМ ПОЛНОСТЬЮ
renderer.render(scene,camera); // ОСНОВНАЯ СЦЕНА
renderer_stats_update(0);
renderer.clearDepth(); // УБИРАЕМ ГЛУБИНУ ОТ ПРОШЛОЙ СЦЕНЫ, ТО ЕСТЬ ЛИШНЕЕ
renderer_hud.render(scene_hud,camera_hud); // HUD СЦЕНА
renderer_stats_update(1,renderer_hud);
*/


composer.render();
renderer_stats_update(1,renderer);
renderer.info.reset();
renderer.clearDepth(); // УБИРАЕМ ГЛУБИНУ ОТ ПРОШЛОЙ СЦЕНЫ, ТО ЕСТЬ ЛИШНЕЕ
//renderer.render(mesh["overlay_damage_blood"],camera_hud); // HUD СЦЕНА
renderer_hud.render(scene_hud,camera_hud); // HUD СЦЕНА
renderer_stats_update(2,renderer_hud);
renderer.info.reset();


if(gpu_stats_shader_name==""){ gpu_stats.endQuery(); }


debug_end("renderer");
debug_end("fps");


debug_show();


}

