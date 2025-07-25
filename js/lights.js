// ЦВЕТ ТУМАНА ДЛЯ ШЕЙДЕРОВ
let fogColor=[Number((128/255).toFixed(2)),Number((174/255).toFixed(2)),Number((197/255).toFixed(2))];


let sun_offset_distance=500; // НА КАКОЕ РАССТОЯНИЕ ОТ ПОЛЬЗОВАТЕЛЯ ОТДАЛЯТЬ СОЛНЦЕ ДЛЯ ТЕНИ
let sun_shadow_dection_distance=20; // ЧЕРЕЗ СКОЛЬКО МЕТРОВ ОБНОВЛЯТЬ ПОЗИЦИЮ СОЛНЦА, ЧТОБЫ НЕ БЫЛО ЗАМЕТНО ДЁРГАНИЯ ТЕНЕЙ
let sun_direction=new THREE.Vector3();
let sun_section_x=-Infinity;
let sun_section_z=-Infinity;
// POSTPROCESS
let sun_clip_position=new THREE.Vector4();
let sun_3d_position={x:0,y:0,z:0};
let sun_2d_position={x:0,y:0};


function lights_set(){


// ____________________ ТУМАН ____________________


scene.fog=new THREE.Fog(0x96bbc8,200,750);


// ____________________ СВЕТ ОКРУЖЕНИЯ ____________________


light["ambient"]=new THREE.AmbientLight(0x7c94b2,3.0);
scene.add(light["ambient"]);


// ____________________ СВЕТ СОЛНЦА ____________________


light["sun"]=new THREE.DirectionalLight(0xFFEBAE,5.4);
light["sun"].position.set(60,100,60);
light["sun"].castShadow=true;
light["sun"].shadow.mapSize.width=2048; // 8192 - ВЫЗЫВАЕТ БОЛЬШУЮ НАГРУЗКУ НА ВИДЕОКАРТУ, ЕСЛИ ПОСТОЯННОЕ ОБНОВЛЕНИЕ ТЕНЕЙ
light["sun"].shadow.mapSize.height=2048; // 8192 - ВЫЗЫВАЕТ БОЛЬШУЮ НАГРУЗКУ НА ВИДЕОКАРТУ, ЕСЛИ ПОСТОЯННОЕ ОБНОВЛЕНИЕ ТЕНЕЙ
light["sun"].shadow.camera.near=1.0;
light["sun"].shadow.camera.far=2000;
light["sun"].shadow.camera.left=-200;
light["sun"].shadow.camera.right=200;
light["sun"].shadow.camera.top=200;
light["sun"].shadow.camera.bottom=-200;
light["sun"].shadow.bias=-0.00004;
light["sun"].shadow.radius=0.2; // 1 - DEFAULT
light["sun"].shadow.blurSamples=2; // 8 - DEFAULT
light["sun"].shadow.needsUpdate=true;
light["sun"].shadow.autoUpdate=true;
scene.add(light["sun"]);


sun_direction.set(light["sun"].position.x,light["sun"].position.y,light["sun"].position.z).normalize();


helper["sun"]=new THREE.DirectionalLightHelper(light["sun"],1);
//scene.add(helper["sun"]);


helper["sun_shadow"]=new THREE.CameraHelper(light["sun"].shadow.camera);
//scene.add(helper["sun_shadow"]);


// ____________________ ПОЛУСВЕТ ____________________

/*
light["hemiLight"]=new THREE.HemisphereLight(0xFEEFC2,0x444444,3);
light["hemiLight"].position.set(0,2,0);
scene.add(light["hemiLight"]);


helper["HemisphereLight"]=new THREE.HemisphereLightHelper(light["hemiLight"],0.2);
scene.add(helper["HemisphereLight"]);
*/

}


function sun_direction_upadte(){
	
	
let dir=camera.matrixWorld.elements;
sun_direction.set(-dir[8],-dir[9],-dir[10]);
sun_position_update_now();


}


function sun_position_update(){


let sun_now_section_x=Math.floor(camera.position.x/2);
let sun_now_section_z=Math.floor(camera.position.z/2);


let distance=Math.sqrt((sun_section_x-camera.position.x)**2+(sun_section_z-camera.position.z)**2);


if(distance>sun_shadow_dection_distance){
sun_position_update_now();
}


}


function sun_position_update_now(){
	
	
sun_section_x=camera.position.x;
sun_section_z=camera.position.z;
light["sun"].position.set(sun_direction.x,sun_direction.y,sun_direction.z).multiplyScalar(sun_offset_distance);	
light["sun"].position.add(camera.position);
light["sun"].target.position.set(camera.position.x,camera.position.y,camera.position.z);
light["sun"].target.updateMatrixWorld();
light["sun"].shadow.camera.updateMatrixWorld();
light["sun"].shadow.camera.updateProjectionMatrix();	


}


function sun_clip_position_update(){
	
	
sun_clip_position.set(sun_direction.x,sun_direction.y,sun_direction.z,0);	
sun_clip_position.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
sun_clip_position.x=(sun_clip_position.x/sun_clip_position.w+1)/2;
sun_clip_position.y=(sun_clip_position.y/sun_clip_position.w+1)/2;
let sun_visible=sun_clip_position.z>0;
sun_3d_position.x=sun_visible?sun_clip_position.x:-1;
sun_3d_position.y=sun_visible?sun_clip_position.y:-1;
sun_3d_position.z=sun_visible?sun_clip_position.z:-1;
sun_2d_position.x=(sun_clip_position.x*2-1)*screen_aspect_ratio;
sun_2d_position.y=sun_clip_position.y*2-1;

	
}

