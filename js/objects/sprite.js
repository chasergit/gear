function sprite_set(){


let geometry=new THREE.InstancedBufferGeometry();
geometry.setAttribute("position",new THREE.Float32BufferAttribute(new Float32Array([-0.5,0.5,0,-0.5,-0.5,0,0.5,0.5,0,0.5,-0.5,0,0.5,0.5,0,-0.5,-0.5,0]),3));
geometry.setAttribute("uv",new THREE.Float32BufferAttribute(new Float32Array([0,1,0,0,1,1,1,0,1,1,0,0]),2));
geometry.setAttribute("offset",new THREE.InstancedBufferAttribute(new Float32Array(),3));
geometry.setAttribute("scale",new THREE.InstancedBufferAttribute(new Float32Array(),2));
geometry.setAttribute("quaternion",new THREE.InstancedBufferAttribute(new Float32Array(),4));
geometry.setAttribute("rotation",new THREE.InstancedBufferAttribute(new Float32Array(),1));
geometry.setAttribute("color",new THREE.InstancedBufferAttribute(new Float32Array(),4));
geometry.setAttribute("blend",new THREE.InstancedBufferAttribute(new Float32Array(),1));
geometry.setAttribute("frame",new THREE.InstancedBufferAttribute(new Float32Array(),4));
geometry.setAttribute("texture",new THREE.InstancedBufferAttribute(new Uint8Array(),1));


mat["sprite"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["atlas_sprite"]},
cameraDirection:{value:[0,0,0]},
cameraAngle:{value:[0,0]},
tDepth:{value:null},
screen_resolution:{value:null},
time:{value:0}
},
defines:{
depth:true
},
vertexShader:vs["sprite"],
fragmentShader:fs["sprite"],
glslVersion:THREE.GLSL3,
side:THREE.DoubleSide,
transparent:true,
depthWrite:false,
blending:THREE.CustomBlending,
blendEquation:THREE.AddEquation,
blendSrc:THREE.OneFactor,
blendDst:THREE.OneMinusSrcAlphaFactor
});


mesh["sprite"]=new THREE.Mesh(geometry,mat["sprite"]);
mesh["sprite"].frustumCulled=false;
mesh["sprite"].matrixAutoUpdate=false;
mesh["sprite"].updateMatrixWorld=function(){};
mesh["sprite"].onBeforeRender=function(){
mat["sprite"].uniforms.tDepth.value=water_rtt_scene.depthTexture;
}
scene.add(mesh["sprite"]);


modules_to_resize.push(function(){ mat["sprite"].uniforms.screen_resolution.value=screen_resolution; });


}


function sprite_far_set(){


let geometry=new THREE.InstancedBufferGeometry();
geometry.setAttribute("position",new THREE.Float32BufferAttribute(new Float32Array([-0.5,0.5,0,-0.5,-0.5,0,0.5,0.5,0,0.5,-0.5,0,0.5,0.5,0,-0.5,-0.5,0]),3));
geometry.setAttribute("uv",new THREE.Float32BufferAttribute(new Float32Array([0,1,0,0,1,1,1,0,1,1,0,0]),2));
geometry.setAttribute("offset",new THREE.InstancedBufferAttribute(new Float32Array(),3));
geometry.setAttribute("scale",new THREE.InstancedBufferAttribute(new Float32Array(),2));
geometry.setAttribute("quaternion",new THREE.InstancedBufferAttribute(new Float32Array(),4));
geometry.setAttribute("rotation",new THREE.InstancedBufferAttribute(new Float32Array(),1));
geometry.setAttribute("color",new THREE.InstancedBufferAttribute(new Float32Array(),4));
geometry.setAttribute("blend",new THREE.InstancedBufferAttribute(new Float32Array(),1));
geometry.setAttribute("frame",new THREE.InstancedBufferAttribute(new Float32Array(),4));
geometry.setAttribute("texture",new THREE.InstancedBufferAttribute(new Uint8Array(),1));


mat["sprite_far"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["atlas_sprite"]},
cameraDirection:{value:[0,0,0]},
cameraAngle:{value:[0,0]},
screen_resolution:{value:null},
time:{value:0}
},
vertexShader:vs["sprite"],
fragmentShader:fs["sprite"],
glslVersion:THREE.GLSL3,
// НЕЛЬЗЯ ДВУХСТОРОННЕЕ, ИНАЧЕ СПРАЙТЫ НАКЛАДЫВАЮТСЯ НЕ ПО-ПОРЯДКУ, КОГДА СПРАЙТ ЛИЦОМ ОТ КАМЕРЫ, НО ИЗ-ЗА ДВУХСТОРОННОСТИ ВСЁ-РАВНО ОТОБРАЖАЕТСЯ
//side:THREE.DoubleSide,
transparent:true,
depthWrite:false,
blending:THREE.CustomBlending,
blendEquation:THREE.AddEquation,
blendSrc:THREE.OneFactor,
blendDst:THREE.OneMinusSrcAlphaFactor
});


mesh["sprite_far"]=new THREE.Mesh(geometry,mat["sprite_far"]);
mesh["sprite_far"].renderOrder=-1;
mesh["sprite_far"].frustumCulled=false;
mesh["sprite_far"].matrixAutoUpdate=false;
mesh["sprite_far"].updateMatrixWorld=function(){};
scene.add(mesh["sprite_far"]);


modules_to_resize.push(function(){ mat["sprite_far"].uniforms.screen_resolution.value=screen_resolution; });


}


function sprites_update(items,sort,name){


let values=[]; 


let max=items.length;
for(let n=0;n<max;n++){
let max_2=items[n].length;
// ЕСЛИ БЕЗ КЛЮЧА
if(max_2){
for(let k=0;k<max_2;k++){
values.push(items[n][k]);
}	
}
else{
// ЕСЛИ С КЛЮЧОМ	
for(let i in items[n]){
values.push(items[n][i]);
}
}
}


let count=values.length;


if(sort){


let item=camera_position;
let x=item.x;
let y=item.y;
let z=item.z;


let n=count;
while(n--){
let item=values[n].offset;
values[n].d=Math.sqrt(Math.pow((x-item[0]),2)+Math.pow((y-item[1]),2)+Math.pow((z-item[2]),2));
}


values.sort((a,b)=>b.d-a.d);


}


let offset=new Float32Array(count*3);
let scale=new Float32Array(count*2);
let quaternion=new Float32Array(count*4);
let rotation=new Float32Array(count);
let color=new Float32Array(count*4);
let blend=new Float32Array(count);
let frame=new Float32Array(count*4);
let texture=new Float32Array(count);


let n=count;


while(n--){


// ОДНО ЗНАЧЕНИЕ
let item=values[n];
rotation[n]=item.rotation;
texture[n]=item.texture;
blend[n]=item.blend;


// ДВА ЗНАЧЕНИЯ
let i0=n*2;
let i1=i0+1;
let i=item.scale;
scale[i0]=i[0];
scale[i1]=i[1];


// ТРИ ЗНАЧЕНИЯ
i0=n*3;
i1=i0+1;
let i2=i0+2;
i=item.offset;
offset[i0]=i[0];
offset[i1]=i[1];
offset[i2]=i[2];


// ЧЕТЫРЕ ЗНАЧЕНИЯ
i0=n*4;
i1=i0+1;
i2=i0+2;
let i3=i0+3;
i=item.color;
color[i0]=i[0];
color[i1]=i[1];
color[i2]=i[2];
color[i3]=i[3];
i=item.quaternion;
quaternion[i0]=i[0];
quaternion[i1]=i[1];
quaternion[i2]=i[2];
quaternion[i3]=i[3];
i=item.frame;
frame[i0]=i[0];
frame[i1]=i[1];
frame[i2]=i[2];
frame[i3]=i[3];


}


// УСТАНАВЛИВАЕМ ДИНАМИЧНОСТЬ, ЧТОБЫ НЕ БЫЛО СКАЧКОВ FPS ПРИ УДАЛЕНИИ МУСОРА В ОЗУ


let item=mesh[name].geometry.attributes;
item.offset=new THREE.InstancedBufferAttribute(offset,3).setUsage(THREE.StreamDrawUsage);
item.scale=new THREE.InstancedBufferAttribute(scale,2).setUsage(THREE.StreamDrawUsage);
item.quaternion=new THREE.InstancedBufferAttribute(quaternion,4).setUsage(THREE.StreamDrawUsage);
item.rotation=new THREE.InstancedBufferAttribute(rotation,1).setUsage(THREE.StreamDrawUsage);
item.color=new THREE.InstancedBufferAttribute(color,4).setUsage(THREE.StreamDrawUsage);
item.blend=new THREE.InstancedBufferAttribute(blend,1).setUsage(THREE.StreamDrawUsage);
item.frame=new THREE.InstancedBufferAttribute(frame,4).setUsage(THREE.StreamDrawUsage);
item.texture=new THREE.InstancedBufferAttribute(texture,1).setUsage(THREE.StreamDrawUsage);


// ТАК КАК ДИНАМИЧЕСКИЙ ВАРИАНТ, ТО НЕОБХОДИМО УКАЗЫВАТЬ КОЛИЧЕСТВО


mesh[name].geometry._maxInstanceCount=count;


}