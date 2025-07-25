let shadow_ground_texture_size=1024;
let shadow_ground_square=500; // РАЗМЕР ТЕКСТУРЫ В МЕТРАХ, Т.Е. РАЗМЕР ГЕОМЕТРИИ
let shadow_ground_mini=2; // ЕСЛИ НАДО УМЕНЬШИТЬ СЕКТОР, ЧТОБЫ ЧАЩЕ РИСОВАЛО ТЕНИ И ОНИ НЕ РАСТЯГИВАЛИСЬ ВДАЛИ (АРТЕФАКТ), ТО СТАВИМ 2
let shadow_ground_cell_size_1=62.5/shadow_ground_mini;
let shadow_ground_cell_size_2=shadow_ground_cell_size_1/shadow_ground_mini;
let shadow_ground_pixel=Number((shadow_ground_texture_size/shadow_ground_square).toFixed(2));
let shadow_ground_w=0; // В КАКУЮ СТОРОНУ БЫЛ ПЕРЕХОД
let shadow_ground_px=-999; // ПРЕДУДЫЩИЙ СЕКТОР ПО X
let shadow_ground_pz=0; // ПРЕДУДЫЩИЙ СЕКТОР ПО Z
let shadow_ground_nx=0; // ТЕКУЩИЙ СЕКТОР ПО X
let shadow_ground_nz=0; // ТЕКУЩИЙ СЕКТОР ПО Z
let shadow_ground_rtt;
let shadow_ground_cell=[];


function shadow_ground_set(){


shadow_ground_rtt=new THREE.WebGLRenderTarget(shadow_ground_texture_size,shadow_ground_texture_size,{format:THREE.RedFormat,type:THREE.UnsignedByteType,depthBuffer:false});


vs["shadow_ground_objects"]=`
attribute vec3 position;
uniform vec2 screen_transform;
uniform vec2 offset;
void main() {
gl_Position=vec4((position.xz+offset)*screen_transform.xy+vec2(-1.0,1.0),0.0,1.0);
gl_PointSize=10.0;
}
`;


fs["shadow_ground_objects"]=`
uniform sampler2D map;
void main() {
gl_FragColor=texture2D(map,gl_PointCoord);
}
`;


mat["shadow_ground_objects"]=new THREE.RawShaderMaterial({
uniforms:{
map:{value:tex["shadow_tree"]},
// РАЗМЕР СЕКТОРА ЛАНДШАФТА
screen_transform:{value:[2.0/500.0,2.0/500.0]},
offset:{value:[0,0]}
},
vertexShader:vs["shadow_ground_objects"],
fragmentShader:fs["shadow_ground_objects"],
depthTest:false,
depthWrite:false,
transparent:true
});


let geometry=new THREE.BufferGeometry();
geometry.setAttribute("position",new THREE.BufferAttribute());
mesh["shadow_ground_objects"]=new THREE.Points(geometry,mat["shadow_ground_objects"]);
mesh["shadow_ground_objects"].matrixAutoUpdate=false;
mesh["shadow_ground_objects"].updateMatrixWorld=function(){};
mesh["shadow_ground_objects"].frustumCulled=false;

/*
vs["shadow_ground_border"]=`
attribute vec3 position;
uniform vec2 screen_transform;
uniform vec2 offset;
void main() {
gl_Position=vec4((position.xz+offset)*screen_transform.xy+vec2(-1.0,1.0),0.0,1.0);
gl_PointSize=20.0;
}
`;


fs["shadow_ground_border"]=`
uniform sampler2D map;
void main() {
gl_FragColor=vec4(0.0,0.0,0.0,1.0);
}
`;


mat["shadow_ground_border"]=new THREE.RawShaderMaterial({
uniforms:{
map:{value:tex["shadow_tree"]},
// РАЗМЕР СЕКТОРА ЛАНДШАФТА
screen_transform:{value:[2.0/500.0,2.0/500.0]},
offset:{value:[0,0]}
},
vertexShader:vs["shadow_ground_border"],
fragmentShader:fs["shadow_ground_border"],
depthTest:false,
depthWrite:false,
transparent:true
});


let geometry_2=new THREE.BufferGeometry();
geometry_2.setAttribute("position",new THREE.BufferAttribute(new Float32Array(12),3));
geometry_2.attributes.position.array[0]=20;
geometry_2.attributes.position.array[2]=-20;
geometry_2.attributes.position.array[3]=480;
geometry_2.attributes.position.array[5]=-20;
geometry_2.attributes.position.array[6]=20;
geometry_2.attributes.position.array[8]=-480;
geometry_2.attributes.position.array[9]=480;
geometry_2.attributes.position.array[11]=-480;


mesh["shadow_ground_border"]=new THREE.Points(geometry_2,mat["shadow_ground_border"]);
mesh["shadow_ground_border"].matrixAutoUpdate=false;
mesh["shadow_ground_border"].updateMatrixWorld=function(){};
mesh["shadow_ground_border"].frustumCulled=false;
mesh["shadow_ground_border"].geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
mesh["shadow_ground_border"].geometry.attributes.position.needsUpdate=true;
*/

}


function shadow_ground_render(){
	
	
shadow_ground_nx=Math.floor(player.position.x/shadow_ground_cell_size_1);
shadow_ground_nz=Math.floor(player.position.z/shadow_ground_cell_size_1);


let shadow_ground_w=0;


if(player.position.x>shadow_ground_px*shadow_ground_cell_size_1+shadow_ground_cell_size_1+shadow_ground_cell_size_2){ shadow_ground_w=1; }
if(player.position.z<shadow_ground_pz*shadow_ground_cell_size_1-shadow_ground_cell_size_2){ shadow_ground_w=2; }
if(player.position.x<shadow_ground_px*shadow_ground_cell_size_1-shadow_ground_cell_size_1){ shadow_ground_w=3; }
if(player.position.z>shadow_ground_pz*shadow_ground_cell_size_1+shadow_ground_cell_size_1){ shadow_ground_w=4; }


if(shadow_ground_w>0){
	

let shadow_ground_start_ms=performance.now();


shadow_ground_px=shadow_ground_nx;
shadow_ground_pz=shadow_ground_nz;


mesh["shadow_ground_objects"].geometry.attributes.position=new THREE.BufferAttribute().copy(mesh["instance_grass_long"].geometry.attributes.offset);


shadow_ground_nx=Math.floor(player.position.x/shadow_ground_cell_size_1);
shadow_ground_nz=Math.floor(player.position.z/shadow_ground_cell_size_1);
mat["terrain"].uniforms.shadow_ground_offset.value=[-shadow_ground_nx*(0.125/shadow_ground_mini)+0.5,-shadow_ground_nz*(0.125/shadow_ground_mini)+0.375];
mat["shadow_ground_objects"].uniforms.offset.value=[500.0*mat["terrain"].uniforms.shadow_ground_offset.value[0],500.0*(-shadow_ground_nz*(0.125/shadow_ground_mini)-0.625)];


renderer.setRenderTarget(shadow_ground_rtt);
renderer.clear();
renderer.render(mesh["shadow_ground_objects"],camera);
//renderer.render(mesh["shadow_ground_border"],camera);
renderer.setRenderTarget(null);
mat["terrain"].uniforms.shadow_ground_map.value=shadow_ground_rtt.texture;


debug_text.push(["shadow_ground_1","<font>["+shadow_ground_w+"]</font> "+(performance.now()-shadow_ground_start_ms).toFixed(3)+""]);


}


}