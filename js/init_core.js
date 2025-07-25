function window_set(){


window.sun_direction=sun_direction;
window.camera=camera;
window.camera_hud=camera_hud;
window.tex=tex;
window.mat=mat;
window.vs=vs;
window.fs=fs;
window.mesh=mesh;
window.scene=scene;
window.scene_2=scene_2;
window.scene_hud=scene_hud;
window.renderer=renderer;
window.underwater_pass=underwater_pass;
window.underwater_ripples_pass=underwater_ripples_pass;
window.correction_pass=correction_pass;
window.unrealbloom_pass=unrealbloom_pass;
window.THREE=THREE;
window.helper=helper;
window.light=light;
window.mixer=mixer;
window.mixers=mixers;
window.action=action;


window.player=player;
window.intersection_ray_triangle=intersection_ray_triangle;
window.RGBELoader=RGBELoader;
window.composer_rtt=composer_rtt;
window.composer=composer;
window.waterline_rtt=waterline_rtt;
window.water=water;
window.sprites_update=sprites_update;
window.camera_position=camera_position;
window.camera_direction=camera_direction;
window.debug=debug;
window.debug_text=debug_text;
window.player_speed_floor=player_speed_floor;


}


//____________________ ОКРУЖЕНИЕ ____________________


let scene_envMap_backed=new THREE.WebGLCubeRenderTarget(
1024,{
depthBuffer:false,
format:THREE.RGBAFormat,
colorSpace:THREE.SRGBColorSpace
});


let scene_envMap_camera=new THREE.CubeCamera(1,10,scene_envMap_backed);
let scene_envMap_scene=new THREE.Scene();


function audio(){
	

let audioLoader=new THREE.AudioLoader();
let audio_listener=new THREE.AudioListener();


// ____________________ ЗАГРУЗКА ЗВУКОВ ____________________


// ПОКА ПОЛЬЗОВАТЕЛЬ НЕ КЛИКНЕТ ПО ЭКРАНУ И НЕ ЗАПУСТИТСЯ ЗВУК, listener.context.state РАВЕН "suspended", ВМЕСТО "running". И В КАЖДОМ КАДРЕ ОБНОВЛЯЕТСЯ listener И ДАЁТ ПАДЕНИЕ FPS

/*
camera.add(audio_listener);


let positional_audio=new THREE.PositionalAudio(audio_listener);
positional_audio.position.set(3,1,0);
positional_audio.setRefDistance(1);
positional_audio.setRolloffFactor(1);
positional_audio.setDirectionalCone(180,230,0.1);
positional_audio.loop=true;
helper["positional_audio"]=new PositionalAudioHelper(positional_audio,1.0);
positional_audio.add(helper["positional_audio"]);
scene.add(positional_audio);


positional_audio.setBuffer(sound["run_grass"]);
window.positional_audio=positional_audio;
*/
/*

positional_audio.position.set(18,2,53);
setInterval("try{positional_audio.position.z=53+Math.sin(performance.now()/100)*5;sounds_listener_update();sounds_panner_update(positional_audio,sounds_panner_i[9],0);}catch(e){}",20);


sounds_delete_fast("bb");
positional_audio.play();



sounds_delete_fast("bb");
positional_audio.stop();
time_delta=0;
sounds_play("bb","run_grass",true,false,1,0,1,false,"","",positional_audio,180,230,0.1,1,1);


let min=9090;
for(let z=0;z<100;z++){
let started=performance.now();
for(let n=0;n<1000;n++){
sounds_panner_update(positional_audio,sounds_panner_i[9],0);
}
let elap=performance.now()-started;
if(min>elap){ min=elap; }
}
console.log(min);

*/


}


function init_core(){


//audio();


event_listeners_set();


debug_init();
debug_set("Javascript","javascript");
debug_set("Renderer","renderer");
debug_set("FPS","fps");
debug_set("Анимации","animations");
debug_set("Sprite","sprite");
debug_set("Sprite far","sprite_far");
debug_set("Raycast terrain 1","raycast_terrain_1");
debug_set("Raycast terrain 2","raycast_terrain_2");
debug_set("Position","position");
debug_set("Section 100","section_100");
debug_set("Section pass total","section_pass");
debug_set("Shadow_ground_1","shadow_ground_1");
debug_set("Shadow_ground_2","shadow_ground_2");
debug_set("status_i_ray_sphere","status_i_ray_sphere");
debug_set("status_i_ray_AABB","status_i_ray_AABB");
debug_set("Grass placed","grass_placed");


world_octree.fromGraphNode(mesh["terrain"]);
world_octree.fromGraphNode(mesh["Box002"]);
world_octree.fromGraphNode(mesh["Box003"]);
world_octree.fromGraphNode(mesh["Box004"]);
world_octree.fromGraphNode(mesh["home"]);
world_octree.fromGraphNode(mesh["home001"]);
world_octree.fromGraphNode(mesh["stone"]);
world_octree.fromGraphNode(mesh["stone_2"]);


mesh["a1"]=new THREE.Mesh(new THREE.BoxGeometry(1,0.2,1),new THREE.MeshStandardMaterial({color:0xffffff}));
mesh["a1"].position.set(23,-0.1,5);
scene.add(mesh["a1"]);


mesh["a2"]=new THREE.Mesh(new THREE.BoxGeometry(1,0.2,1),new THREE.MeshStandardMaterial({color:0xffffff}));
mesh["a2"].position.set(23,1.9,5);
scene.add(mesh["a2"]);


world_octree.fromGraphNode(mesh["a1"]);
world_octree.fromGraphNode(mesh["a2"]);


mesh["grid_1m_1"]=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xffc000,map:tex["grid_1m"]}));
mesh["grid_1m_1"].position.set(0,0.5,0);
scene.add(mesh["grid_1m_1"]);


mesh["grid_1m_2"]=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xffffff,map:tex["grid_1m"]}));
mesh["grid_1m_2"].position.set(0,1.5,0);
scene.add(mesh["grid_1m_2"]);


let cube_texture_loader=new THREE.CubeTextureLoader(loadingManager);
cube_texture_loader.setPath("./images/sky/");
//let environment_texture=cube_texture_loader.load(["lf.jpg","rt.jpg","up.jpg","dn.jpg","ft.jpg","bk.jpg"]);
//let environment_texture=cube_texture_loader.load(["lf.png","rt.png","up.png","dn.png","ft.png","bk.png"]);
//let environment_texture=cube_texture_loader.load(["px.png","nx.png","py.png","ny.png","pz.png","nz.png"]);
//let environment_texture=cube_texture_loader.load(["px.jpg","nx.jpg","py.jpg","ny.jpg","pz.jpg","nz.jpg"]);
//let environment_texture=cube_texture_loader.load(["lf.jpg","rt.jpg","up.jpg","dn.jpg","ft.jpg","bk.jpg"]);
//let environment_texture=cube_texture_loader.load(["px.jpg","nx.jpg","py.jpg","ny.jpg","pz.jpg","nz.jpg"]);


// ДЛЯ HDR ТЕКСТУРЫ ВОЗВРАЩАЕМ ЦВЕТА
THREE.ShaderLib.backgroundCube.fragmentShader=THREE.ShaderLib.backgroundCube.fragmentShader.replace(
"#include <tonemapping_fragment>",
`float toneMappingExposure=1.0;
const float StartCompression=0.8-0.04;
const float Desaturation=0.15;
gl_FragColor.rgb*=toneMappingExposure;
float x=min(gl_FragColor.r,min(gl_FragColor.g,gl_FragColor.b));
float offset=x<0.08?x-6.25*x*x:0.04;
gl_FragColor.rgb-=offset;
float peak=max(gl_FragColor.r,max(gl_FragColor.g,gl_FragColor.b));
if(peak>StartCompression){
float d=1.-StartCompression;
float newPeak=1.-d*d/(peak+d-StartCompression);
gl_FragColor.rgb*=newPeak/peak;
float g=1.-1./(Desaturation*(peak-newPeak)+1.);
gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(newPeak),g);
}`
);


scene.background=environment_main;
//scene.background=environment_texture;


// !!! ВАЖНО. УБРАТЬ, ЕСЛИ У ВОДЫ НЕ БУДЕТ ДВУХСТОРОННЕГО ОТОБРАЖЕНИЯ
scene_2.background=environment_main;


scene_envMap_scene.backgroundBlurriness=0.0;
scene_envMap_scene.background=environment_main;
scene_envMap_camera.update(renderer,scene_envMap_scene);


music_effects_gen();
sounds_effects_gen();
sounds_volume_gen(10);
lights_set();
scene_2.children.push(light["ambient"]);
scene_2.children.push(light["sun"]);


lightMap.uv_set(mesh); // СПЕРВА ДОБАВЛЯЕМ UV ДЛЯ LIGHTMAP


// УБИРАЕМ ДУБЛИКАТЫ МАТЕРИАЛОВ
for(let i in mesh){
if(!mesh[i].material || !mesh[i].material.length){ continue; }
materials_duplicates_remover(mesh[i]);
}


lightMap.tex_set(mesh,tex); // ТОЛЬКО ТЕПЕРЬ ДОБАВЛЯЕМ ТЕКСТУРЫ LIGHTMAP


soldiers_set();
weapon_sway_set();
soldiers_gun_set();
player_gun_set();


grass_mesh_create();
grass_place();


tex["atlas_sprite"]=DataArrayTexture_set([tex["a-0"],tex["a-1"],tex["a-2"]]);


atlas_set();
sprite_set();
sprite_far_set();
sprites_set();
shadow_ground_set();
crosshair_set();
water_set();
overlay_damage_blood();
other_set();
press_q();
window_set();


}


function soldiers_set(){


mesh["soldier_attack_1"]=SkeletonUtils.clone(mesh["soldier"]);
mesh["soldier_attack_1"].animations=mesh["soldier"].animations;
mixer["soldier_attack_1"]=new THREE.AnimationMixer(mesh["soldier_attack_1"]);
action["soldier_attack_1"]=THREE.AnimationUtils.subclip(mesh["soldier_attack_1"].animations[0],"attack",0,100);
action["soldier_attack_1"]=mixer["soldier_attack_1"].clipAction(action["soldier_attack_1"]);
action["soldier_attack_1"].play();
mixers.push(mixer["soldier_attack_1"]);
mesh["soldier_attack_1"].animations=[];
mesh["soldier_attack_1"].scale.set(0.025,0.025,0.025);
mesh["soldier_attack_1"].position.set(-2,0,-8);
mesh["soldier_attack_1"].rotation.y=0;
mesh["soldier_attack_1"].children[1].frustumCulled=false;
mesh["soldier_attack_1"].children[1].onAfterRender=function(){
this.frustumCulled=true;
this.onAfterRender=function(){};
}
scene.add(mesh["soldier_attack_1"]);


mesh["soldier_attack_2"]=SkeletonUtils.clone(mesh["soldier"]);
mesh["soldier_attack_2"].animations=mesh["soldier"].animations;
mixer["soldier_attack_2"]=new THREE.AnimationMixer(mesh["soldier_attack_2"]);
action["soldier_attack_2"]=THREE.AnimationUtils.subclip(mesh["soldier_attack_2"].animations[0],"attack",0,100);
action["soldier_attack_2"]=mixer["soldier_attack_2"].clipAction(action["soldier_attack_2"]);
action["soldier_attack_2"].play();
mixers.push(mixer["soldier_attack_2"]);
mesh["soldier_attack_2"].animations=[];
mesh["soldier_attack_2"].scale.set(0.025,0.025,0.025);
mesh["soldier_attack_2"].position.set(2,0,-8);
mesh["soldier_attack_2"].rotation.y=0;
mesh["soldier_attack_2"].children[1].frustumCulled=false;
mesh["soldier_attack_2"].children[1].onAfterRender=function(){
this.frustumCulled=true;
this.onAfterRender=function(){};
}
scene.add(mesh["soldier_attack_2"]);


}


dummy["shot_spread"]=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,1),new THREE.MeshStandardMaterial({color:0xff0000}));
dummy["shot_spread"].matrixAutoUpdate=false;
dummy["shot_spread"].updateMatrixWorld=function(){};
dummy["shot_spread"].geometry.translate(0,0,0.5);
scene.add(dummy["shot_spread"]);


mesh["shot_bullet"]=new THREE.Mesh(new THREE.SphereGeometry(0.01,32,32),new THREE.MeshPhongMaterial({color:0xffc000}));
scene.add(mesh["shot_bullet"]);


let spread=new THREE.Vector3();
let m_radius=1.0;
let theta=2*Math.PI*Math.random();
let r=Math.sqrt(Math.random());
r=0.45;
spread.x=r*m_radius*Math.cos(theta);
spread.y=r*m_radius*Math.sin(theta);
spread.z=-1;
spread.normalize();
dummy["shot_spread"].lookAt(spread);
dummy["shot_spread"].updateMatrix();
mesh["shot_bullet"].position.set(spread.x,spread.y,spread.z);


function spread_update(){
	
	
theta+=0.01;
spread.x=r*m_radius*Math.cos(theta);
spread.y=r*m_radius*Math.sin(theta);
spread.z=-1;
spread.normalize();
dummy["shot_spread"].lookAt(spread);
dummy["shot_spread"].updateMatrix();
let ddd=new THREE.Quaternion();
camera.updateProjectionMatrix();
camera.getWorldQuaternion(ddd);
spread.applyQuaternion(ddd);
mesh["shot_bullet"].position.set(spread.x+camera_position.x,spread.y+camera_position.y,spread.z+camera_position.z);


}


function soldiers_gun_set(){


mesh["soldier_attack_1"].traverse(function(child){
if(child.name=="swatRightHand"){


mesh["soldier_1_gun"]=mesh["gun"].clone();
scene.add(mesh["soldier_1_gun"]);
mesh["soldier_1_gun"].parent=child;
mesh["soldier_1_gun"].position.set(-12,-2,3);
mesh["soldier_1_gun"].scale.set(2000,2000,2000);
mesh["soldier_1_gun"].rotation.set(1.57,3.3,0);
mesh["soldier_1_gun"].name="soldier_1_gun";


}
});


mesh["soldier_attack_2"].traverse(function(child){
if(child.name=="swatRightHand"){


mesh["soldier_2_gun"]=mesh["gun"].clone();
scene.add(mesh["soldier_2_gun"]);
mesh["soldier_2_gun"].parent=child;
mesh["soldier_2_gun"].position.set(-12,-2,3);
mesh["soldier_2_gun"].scale.set(2000,2000,2000);
mesh["soldier_2_gun"].rotation.set(1.57,3.3,0);
mesh["soldier_2_gun"].name="soldier_2_gun";


}
});


}


function other_set(){


mesh["home"].castShadow=true;
mesh["home001"].castShadow=true;
mesh["Box002"].castShadow=true;


scene_2.children.push(mesh["terrain"]);


mesh["terrain"].receiveShadow=true;
mesh["terrain"].castShadow=true;


mat["terrain"]=new THREE.MeshStandardMaterial({
map:tex["ground_1_diffuse"],
alphaMap:tex["terrain_noise"],
aoMap:tex["dirt"],
aoMapIntensity:0,
//roughnessMap:tex["ground_1_roughness"],
roughness:0.8,
normalMap:tex["ground_1_normal"],
normalScale:{x:1,y:1},
});


mesh["terrain"].material=mat["terrain"];


mat["terrain"].onBeforeCompile=(shader)=>{
//console.log(shader.vertexShader);
//console.log(shader.fragmentShader);


shader.fragmentShader=shader.fragmentShader.replace("#include <normal_fragment_begin>",
`
float faceDirection=gl_FrontFacing?1.0:-1.0;


vec3 normal=normalize(vNormal);


#ifdef DOUBLE_SIDED
normal*=faceDirection;
#endif


mat3 tbn=getTangentFrame(-vViewPosition,normal,vNormalMapUv);


#if defined( DOUBLE_SIDED )
tbn[0]*=faceDirection;
tbn[1]*=faceDirection;
#endif


vec3 nonPerturbedNormal=normal;
`);


shader.fragmentShader=shader.fragmentShader.replace("#include <normal_fragment_maps>",
`
vec3 mapN=texture2D(normalMap,vNormalMapUv).xyz*2.0-1.0;
mapN.xy*=normalScale;
normal=normalize(tbn*mapN);


vec3 eye_pos=-vViewPosition;
vec2 vUv=vNormalMapUv;
vec3 N=vNormal;


vec3 q0=dFdx(eye_pos.xyz);
vec3 q1=dFdy(eye_pos.xyz);
vec2 st0=dFdx(vUv);
vec2 st1=dFdy(vUv);
vec3 q1perp=cross(q1,N);
vec3 q0perp=cross(N,q0);
vec3 T=q1perp*st0.x+q0perp*st1.x;
vec3 B=q1perp*st0.y+q0perp*st1.y;
float det=max(dot(T,T),dot(B,B));
float scale=(det==0.0)?0.0:inversesqrt(det);
normal=normalize(T*(mapN.x*scale)+B*(mapN.y*scale)+N*mapN.z);


`);


//shader.fragmentShader=shader.fragmentShader.replace("#include <alphamap_fragment>",
//`diffuseColor.rgb*=texture2D(alphaMap,vUv/30.0).rgb*1.0;`);


shader.fragmentShader=shader.fragmentShader.replace("#include <alphamap_fragment>",
`
vec3 tex=texture2D(map,vMapUv).rgb;
float gamma=texture2D(normalMap,vMapUv/50.0).g;
// ДОПОЛНИТЕЛЬНАЯ КАРТА НОРМАЛИ БОЛЬШАЯ
//diffuseColor.rgb=pow(tex,vec3(0.6+gamma/1.0));
diffuseColor.rgb=mix(diffuseColor.rgb,texture2D(aoMap,vMapUv).rgb,texture2D(alphaMap,vMapUv/20.0).r);
diffuseColor.rgb=mix(diffuseColor.rgb,texture2D(aoMap,vMapUv).rgb,texture2D(alphaMap,vMapUv/100.0).r);
//vec3 tex=texture2D(map,vMapUv).rgb*texture2D(map,vMapUv/35.0).rgb*8.0;
//diffuseColor.rgb=tex;
//diffuseColor.rgb=mix(tex,texture2D(aoMap,vMapUv).rgb,texture2D(alphaMap,vMapUv/70.0).r);
//diffuseColor.rgb=mix(texture2D(map,vMapUv).rgb,texture2D(aoMap,vUv).rgb,texture2D(alphaMap,vMapUv/70.0).r);
`);


shader.fragmentShader=shader.fragmentShader.replace("#include <lightmap_fragment>",
``);


shader.fragmentShader=shader.fragmentShader.replace("#include <aomap_fragment>",
`float ambientOcclusion;`);


shader.vertexShader=shader.vertexShader.replace("#include <common>",
`#include <common>
varying vec3 vPosition;
`);


shader.vertexShader=shader.vertexShader.replace("#include <begin_vertex>",
`#include <begin_vertex>
vPosition=vec3( position );
`);


shader.fragmentShader=shader.fragmentShader.replace("#include <common>",
`#include <common>
varying vec3 vPosition;
`);


shader.fragmentShader=shader.fragmentShader.replace("#include <metalnessmap_fragment>",
`#include <metalnessmap_fragment>
metalnessFactor=smoothstep(-0.5,-0.9,vPosition.y)*0.6;
roughnessFactor=mix(0.8,1.0,smoothstep(-0.5,-0.9,vPosition.y));


`);


};

/*
mat["terrain"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["terrain_grass"]},
dirt:{value:tex["terrain_dirt"]},
noise:{value:tex["terrain_noise"]},
aoMap:{value:tex["terrainVRayRawTotalLightingMap"]},
shadow_ground_map:{value:tex["shadow_ground_1"]},
shadow_ground_offset:{value:[0,0]},
fogColor:{value:fogColor},
},
vertexShader:vs["terrain_triplanar"],
fragmentShader:fs["terrain_triplanar"],
});


mesh["terrain"].material=mat["terrain"];
*/

for(let x=-2;x<3;x++){
for(let y=-2;y<0;y++){
if(x==0 && y==0){ continue; }
mesh["terrain_"+x+"_"+y]=mesh["terrain"].clone();
mesh["terrain_"+x+"_"+y].position.set(x*500,0,y*500);
mesh["terrain_"+x+"_"+y].matrixAutoUpdate=true;
mesh["terrain_"+x+"_"+y].updateMatrixWorld();
mesh["terrain_"+x+"_"+y].updateMatrixWorld=function(){};
scene.add(mesh["terrain_"+x+"_"+y]);
}
}


mesh["big_box"]=new THREE.Mesh(new THREE.BoxGeometry(1,5,1),new THREE.MeshStandardMaterial({color:0xffffff}));
mesh["big_box"].castShadow=true;
mesh["big_box"].position.set(47.8,1.8,61.8);
scene.add(mesh["big_box"]);


mesh["big_box_2"]=new THREE.Mesh(new THREE.BoxGeometry(3,5,3),new THREE.MeshStandardMaterial({map:tex["wall_118"]}));
mesh["big_box_2"].castShadow=true;
mesh["big_box_2"].position.set(32,-2.2,85);
scene.children.push(mesh["big_box_2"]);
scene_2.children.push(mesh["big_box_2"]);


mesh["big_box_3"]=new THREE.Mesh(new THREE.BoxGeometry(2,5,2),new THREE.MeshStandardMaterial({color:0xffff00}));
mesh["big_box_3"].castShadow=true;
mesh["big_box_3"].position.set(32,1.8,28);
scene.add(mesh["big_box_3"]);


mesh["big_box_4"]=new THREE.Mesh(new THREE.BoxGeometry(0.1,10,0.1),new THREE.MeshStandardMaterial({color:0xffff00}));
mesh["big_box_4"].castShadow=true;
mesh["big_box_4"].position.set(35.5,0.5,66.5);
scene.children.push(mesh["big_box_4"]);
scene_2.children.push(mesh["big_box_4"]);


mesh["big_box_5"]=new THREE.Mesh(new THREE.BoxGeometry(0.01,10,0.01),new THREE.MeshStandardMaterial({color:0xffff00}));
mesh["big_box_5"].castShadow=true;
mesh["big_box_5"].position.set(32,0.5,72);
scene.children.push(mesh["big_box_5"]);
scene_2.children.push(mesh["big_box_5"]);


mesh["big_box_6"]=new THREE.Mesh(new THREE.BoxGeometry(2,0.4,2),new THREE.MeshStandardMaterial({map:tex["wall_277"],normalMap:tex["wall_278"],normalScale:{x:1.5,y:1.5},roughnessMap:tex["wall_279"],roughness:10}));
mesh["big_box_6"].castShadow=true;
mesh["big_box_6"].position.set(23,-1,94);
scene.children.push(mesh["big_box_6"]);
scene_2.children.push(mesh["big_box_6"]);


mesh["big_box_7"]=new THREE.Mesh(new THREE.BoxGeometry(10,50,10),new THREE.MeshStandardMaterial({color:0xffffff}));
mesh["big_box_7"].castShadow=true;
mesh["big_box_7"].position.set(130,25,50);
scene.add(mesh["big_box_7"]);


mesh["big_box_8"]=new THREE.Mesh(new THREE.BoxGeometry(4,30,1),new THREE.MeshStandardMaterial({color:0xffffff}));
mesh["big_box_8"].castShadow=true;
mesh["big_box_8"].position.set(130,40,55.5);
scene.add(mesh["big_box_8"]);


mesh["big_box_9"]=new THREE.Mesh(new THREE.BoxGeometry(4,30,0.5),new THREE.MeshStandardMaterial({color:0xffffff}));
mesh["big_box_9"].castShadow=true;
mesh["big_box_9"].position.set(0,0,0);
mesh["big_box_9"].rotation.z=1.57;
mesh["big_box_8"].add(mesh["big_box_9"]);


mesh["big_box_10"]=new THREE.Mesh(new THREE.BoxGeometry(1,5,1),new THREE.MeshStandardMaterial({color:0xff0000}));
mesh["big_box_10"].castShadow=true;
mesh["big_box_10"].receiveShadow=true;
mesh["big_box_10"].position.set(34,-2.2,90);
scene.children.push(mesh["big_box_10"]);
scene_2.children.push(mesh["big_box_10"]);


mesh["big_box_11"]=new THREE.Mesh(new THREE.BoxGeometry(1,5,1),new THREE.MeshStandardMaterial({color:0x00ff00}));
mesh["big_box_11"].castShadow=true;
mesh["big_box_11"].receiveShadow=true;
mesh["big_box_11"].position.set(34,-2.2,92);
scene.children.push(mesh["big_box_11"]);
scene_2.children.push(mesh["big_box_11"]);


mesh["big_box_12"]=new THREE.Mesh(new THREE.BoxGeometry(1,5,1),new THREE.MeshStandardMaterial({color:0x0000ff}));
mesh["big_box_12"].castShadow=true;
mesh["big_box_12"].receiveShadow=true;
mesh["big_box_12"].position.set(34,-2.2,94);
scene.children.push(mesh["big_box_12"]);
scene_2.children.push(mesh["big_box_12"]);


mesh["big_box_13"]=new THREE.Mesh(new THREE.BoxGeometry(2,1,0.2),new THREE.MeshStandardMaterial({map:tex["wall_118"]}));
mesh["big_box_13"].castShadow=true;
mesh["big_box_13"].position.set(32,-0.5,86.6);
scene.children.push(mesh["big_box_13"]);
scene_2.children.push(mesh["big_box_13"]);


mesh["mbox"]=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({map:tex["wall_118"]}));
mesh["mbox"].castShadow=true;
mesh["mbox"].position.set(30,-0.5,70);
scene.children.push(mesh["mbox"]);
scene_2.children.push(mesh["mbox"]);


mesh["wall_001"].material=new THREE.MeshStandardMaterial({
map:tex["wall_237"],
envMap:environment_main,
normalMap:tex["wall_238_n"],
normalScale:{x:1,y:-1},
roughness:0.4,
metalness:0.5
});


mesh["wall_002"].material=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["wall_237"]},
mapRepeat:{value:[1,1]},
aoMap:{value:tex["wall_002VRayRawTotalLightingMap"]},
normalMap:{value:tex["wall_238_n"]},
normalRepeat:{value:[1,1]},
normalScale:{value:[1,-1]},
specularMap:{value:tex["specular_test"]},
specularRepeat:{value:[1,1]},
shininess:{value:60},
glossiness:{value:1},
fogColor:{value:fogColor},
envMap:{value:scene.background}
},
vertexShader:vs["standard"],
fragmentShader:fs["standard"],
extensions:{derivatives:true}
});


mesh["wall_003"].material=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["wall_237"]},
mapRepeat:{value:[1,1]},
aoMap:{value:tex["wall_003VRayRawTotalLightingMap"]},
normalMap:{value:tex["wall_238_n"]},
normalRepeat:{value:[1,1]},
normalScale:{value:[1,-1]},
specularMap:{value:tex["specular_test"]},
specularRepeat:{value:[1,1]},
shininess:{value:60},
glossiness:{value:1},
fogColor:{value:fogColor},
envMap:{value:scene.background}
},
vertexShader:vs["standard"],
fragmentShader:fs["standard"],
extensions:{derivatives:true}
});


mesh["rock"]=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshStandardMaterial({
map:tex["bb_diffuse"],
roughness:1.0,
normalMap:tex["bb_normal"],
normalScale:{x:1,y:1}
}));
mesh["rock"].position.set(3.5,0,6);
scene.add(mesh["rock"]);


mesh["tower"]=new THREE.Mesh(new THREE.CylinderGeometry(4,4,30,32,1),new THREE.MeshStandardMaterial({
map:tex["bb_diffuse"],
roughness:0.8,
normalMap:tex["bb_normal"],
normalScale:{x:1,y:1}
}));
mesh["tower"].castShadow=true;
mesh["tower"].position.set(-67,50,72);
scene.add(mesh["tower"]);


mesh["object_i_ray_sphere"]=new THREE.Mesh(new THREE.SphereGeometry(2,16,16),new THREE.MeshBasicMaterial({color:0x009000,opacity:0.5,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
mesh["object_i_ray_sphere"].geometry.computeBoundingSphere();
scene.add(mesh["object_i_ray_sphere"]);


mesh["status_i_ray_sphere"]=new THREE.Mesh(new THREE.SphereGeometry(0.10,3,3),new THREE.MeshLambertMaterial({color:0xffff00}));
scene.add(mesh["status_i_ray_sphere"]);


mesh["status_i_ray_AABB"]=new THREE.Mesh(new THREE.SphereGeometry(0.10,3,3),new THREE.MeshLambertMaterial({color:0xff00ff}));
scene.add(mesh["status_i_ray_AABB"]);


}