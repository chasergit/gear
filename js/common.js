let project=document.getElementById("project");
let canvas=document.getElementById("canvas");
let canvas_hud=document.getElementById("canvas_hud");
let screen_width=project.offsetWidth;
let screen_height=project.offsetHeight;
let canvas_half_width=screen_width/2;
let canvas_half_height=screen_height/2;
let screen_resolution=[screen_width,screen_height];
let screen_aspect_ratio=screen_width/screen_height;
let screen_texel_size=[1.0/screen_width,1.0/screen_height];
let pixel_ratio_origin=Math.min(window.devicePixelRatio,1); // ВЫБИРАЕМ ЗНАЧЕНИЕ <=1, Т.К. НА ТЕЛЕФОНЕ ЛУЧШЕ НЕ БОЛЕЕ 1
let pixel_ratio_quality=1;
let renderer_pixel_ratio=pixel_ratio_origin/pixel_ratio_quality;


let degrees_to_radian=Math.PI/180;
let radian_to_degrees=180/Math.PI;
let PI_half=Math.PI/2;
let PI=Math.PI;
let PI_3=Math.PI*1.5;
let PI_2=Math.PI*2;


function get_random_int(min,max){
return Math.floor(Math.random()*(max-min+1)+min);
}


function get_random_float(min,max){
return Math.random()*(max-min)+min;
}


let vector3=new THREE.Vector3();
let raycaster=new THREE.Raycaster();


let vs=[]; // ВЕРТЕКСНЫЙ ШЕЙДЕР
let fs=[]; // ФРАГМЕНТНЫЙ ШЕЙДЕР
let mat=[];
let mesh=[];
let light=[];
let helper=[];
let dummy=[]; // OBJECT3D(); ДЛЯ ПОВОРОТОВ, ВЕКТОРОВ
let uniforms=[]; // ЮНИФОРМЫ СВОИХ ШЕЙДЕРОВ ДЛЯ БЫСТРОГО ДОСТУПА
let modules_to_resize=[]; // МОДУЛИ, ОБНОВЛЯЕМЫЕ ПРИ ИЗМЕНЕНИИ РАЗМЕРА ЭКРАНА
let mixers=[];
let mixer=[];
let action=[];
let atlas=[]; // ТЕКСТУРЫ АТЛАСОВ
let environment_main;


let key_status=[];
let key_up=[];
let click_left_down=false;
let click_left_up=false;
let click_right_up=false;
let click_right_down=false;


let start_time=Date.now();
let time=0;
let pause=0;
let clock=new THREE.Clock();
let delta=0;


function on_window_resize(){


screen_width=project.offsetWidth;
screen_height=project.offsetHeight;
canvas_half_width=screen_width/2;
canvas_half_height=screen_height/2;
screen_resolution=[screen_width/pixel_ratio_quality,screen_height/pixel_ratio_quality];
screen_aspect_ratio=screen_width/screen_height;
screen_texel_size=[1.0/(screen_width*renderer_pixel_ratio),1.0/(screen_height*renderer_pixel_ratio)];


camera.aspect=screen_aspect_ratio;
camera.updateProjectionMatrix();


camera_hud.left=screen_width/-2;
camera_hud.right=screen_width/2;
camera_hud.top=screen_height/2;
camera_hud.bottom=screen_height/-2;
camera_hud.updateProjectionMatrix();


renderer.setSize(screen_width,screen_height);
renderer_hud.setSize(screen_width,screen_height);


let max=modules_to_resize.length;
for(let n=0;n<max;n++){
modules_to_resize[n]();
}


}


let camera=new THREE.PerspectiveCamera(60,screen_aspect_ratio,0.05,1000);


let camera_hud=new THREE.OrthographicCamera(screen_width/-2,screen_width/2,screen_height/2,screen_height/-2,-1000,1000);


let renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true,premultipliedAlpha:true,logarithmicDepthBuffer:false});
renderer.setClearColor(0x000000,0); // ЦВЕТ И ПРОЗРАЧНОСТЬ ФОНА (alpha). 0 - НЕ ПРОЗРАЧНЫЙ, 1 - ПРОЗРАЧНЫЙ
renderer.setSize(screen_width,screen_height);
renderer.setPixelRatio(renderer_pixel_ratio);
renderer.autoClear=false;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.VSMShadowMap;
renderer.info.autoReset=false;


let renderer_hud=new THREE.WebGLRenderer({canvas:canvas_hud,antialias:true,alpha:true,premultipliedAlpha:true,logarithmicDepthBuffer:false});
renderer_hud.setClearColor(0x000000,0); // ЦВЕТ И ПРОЗРАЧНОСТЬ ФОНА (alpha). 0 - НЕ ПРОЗРАЧНЫЙ, 1 - ПРОЗРАЧНЫЙ
renderer_hud.setSize(screen_width,screen_height);
renderer_hud.setPixelRatio(pixel_ratio_origin);


let scene=new THREE.Scene();
let scene_hud=new THREE.Scene();
let scene_2=new THREE.Scene();


let stats=new Stats();
project.appendChild(stats.dom);


let gpu_stats;
window.gpu_stats=gpu_stats=new GPUStatsPanel(renderer.getContext());
window.gpu_stats_shader_name=""; // ДЛЯ ЗАМЕРА ВРЕМЕНИ ПОСТЭФФЕКТОВ
stats.addPanel(gpu_stats);


project.appendChild(renderer_stats_canvas);


// ____________________ POSTPROCESSING ____________________


let render_pass=new RenderPass(scene,camera);


let composer_rtt=new THREE.WebGLRenderTarget(screen_width,screen_height);
composer_rtt.texture.type=THREE.HalfFloatType;
composer_rtt.texture.generateMipmaps=false;
//composer_rtt.texture.minFilter=THREE.LinearMipmapLinearFilter; // ЕСЛИ СТОИТ generateMipmaps=true 


let composer=new EffectComposer(renderer,composer_rtt);
composer.readBuffer.depthBuffer=true;
composer.readBuffer.depthTexture=new THREE.DepthTexture();
composer.readBuffer.depthTexture.type=THREE.FloatType;
composer.writeBuffer.depthBuffer=true;
composer.writeBuffer.depthTexture=new THREE.DepthTexture();
composer.writeBuffer.depthTexture.type=THREE.FloatType;


modules_to_resize.push(()=>{
composer.setSize(screen_width,screen_height);
});


let underwater_pass=new ShaderPass(underwater_shader);
let underwater_ripples_pass=new ShaderPass(underwater_ripples_shader);


let unrealbloom_pass=new UnrealBloomPass({x:screen_width,y:screen_height},0,0,0);
unrealbloom_pass.threshold=5;
unrealbloom_pass.strength=0.7;
unrealbloom_pass.radius=0;


modules_to_resize.push(()=>{
unrealbloom_pass.setSize(screen_width,screen_height);
});


let correction_pass=new ShaderPass(correction_shader);
correction_pass.material.uniforms.color.value=[1,1,1];
correction_pass.material.uniforms.saturation.value=1.2;
correction_pass.material.uniforms.vibrance.value=0.0;
correction_pass.material.uniforms.gamma.value=1.0;
correction_pass.material.uniforms.brightness.value=0.0;
correction_pass.material.uniforms.contrast.value=0.1;
correction_pass.material.uniforms.vignette.value=0.0;


let fxaa_pass=new ShaderPass(FXAAShader);
fxaa_pass.material.uniforms.resolution.value.x=1/(screen_width*renderer_pixel_ratio);
fxaa_pass.material.uniforms.resolution.value.y=1/(screen_height*renderer_pixel_ratio);


modules_to_resize.push(()=>{
fxaa_pass.material.uniforms.resolution.value.x=1/(screen_width*renderer_pixel_ratio);
fxaa_pass.material.uniforms.resolution.value.y=1/(screen_height*renderer_pixel_ratio);
});


composer.addPass(render_pass);


// ОТОБРАЖЕНИЕ ОРУЖИЯ ВТОРЫМ СЛОЕМ

/*
let render_pass_shadow={};
render_pass_shadow.step=1;
render_pass_shadow.setSize=()=>{};
render_pass_shadow.render=()=>{
if(render_pass_shadow.step==1){
render_pass_shadow.step=2;
// ОТКЛЮЧАЕМ ТЕНИ, ЧТОБЫ ДВА РАЗА НЕ СЧИТАЛО И СОХРАНИЛО ПРЕДЫДУЩИЕ ТЕНИ
light["sun"].last_shadow_autoUpdate=light["sun"].shadow.autoUpdate;
light["sun"].last_shadow_needsUpdate=light["sun"].shadow.needsUpdate;
light["sun"].shadow.autoUpdate=false;	
light["sun"].shadow.needsUpdate=false;
}
else{
render_pass_shadow.step=1;	
light["sun"].shadow.autoUpdate=light["sun"].last_shadow_autoUpdate;	
light["sun"].shadow.needsUpdate=light["sun"].last_shadow_needsUpdate;
}	
}


composer.addPass(render_pass_shadow);


let render_pass_2=new RenderPass(null,camera);
render_pass_2.clear=false;
render_pass_2.clearDepth=true;
composer.addPass(render_pass_2);


composer.addPass(render_pass_shadow);
*/

composer.addPass(underwater_pass);
composer.addPass(underwater_ripples_pass);
composer.addPass(correction_pass);
composer.addPass(unrealbloom_pass);
composer.addPass(fxaa_pass);