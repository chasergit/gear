vs["sprite"]=`


attribute vec3 offset;
attribute vec2 scale;
attribute vec4 quaternion;
attribute vec2 rotation;
attribute vec4 color;
attribute float blend;
attribute float soft;
attribute vec4 frame;
attribute float texture;
varying vec2 vUv;
varying vec4 vColor;
varying float vBlend;
varying float vSoft;
varying vec4 vFrame;
varying float tex_num;
uniform float time;
vec3 up_vector=vec3(0.0,1.0,0.0);
varying float vViewPosition;
varying float angle;
varying vec3 vRotated;


float lens_float(float n,float min_value,float max_value){
return max(0.0,min(1.0,(n-min_value)/(max_value-min_value)));
}


void main(){


vUv=uv;
vColor=color;
vBlend=blend;
vSoft=soft;
tex_num=texture;
vFrame=frame;


vec3 vPosition;


// ПОВОРОТ ПО QUATERNION


if(quaternion.w<2.0){

	
if(rotation.x!=0.0){ angle=time*rotation.x; }
if(rotation.y!=0.0){ angle+=rotation.y; }
vRotated=vec3(position.x*scale.x*cos(angle)-position.y*scale.y*sin(angle),position.y*scale.y*cos(angle)+position.x*scale.x*sin(angle),position.z);
	
	
vec3 vcV=cross(quaternion.xyz,vRotated);
vPosition=vcV*(2.0*quaternion.w)+(cross(quaternion.xyz,vcV)*2.0+vRotated);


}


// ПОВОРОТ ПО НОРМАЛЕ


else if(quaternion.w==3.0){
	
	
if(rotation.x!=0.0){ angle=time*rotation.x; }
if(rotation.y!=0.0){ angle+=rotation.y; }
vRotated=vec3(position.x*scale.x*cos(angle)-position.y*scale.y*sin(angle),position.y*scale.y*cos(angle)+position.x*scale.x*sin(angle),position.z);
	
	
vec3 vLook=quaternion.xyz;
if(dot(vLook,vLook)==0.0){ vLook.z=1.0; }
vLook=normalize(vLook);
vec3 vRight=cross(up_vector,vLook);
if(dot(vRight,vRight)==0.0){
vLook.z+=0.0001;
vLook=normalize(vLook);
vRight=cross(up_vector,vLook);
}
vRight=normalize(vRight);
vec3 vUp=cross(vLook,vRight);
vPosition=vRight*vRotated.x+vUp*vRotated.y+vLook*vRotated.z;


}


// ПОВОРОТ К ТОЧКЕ


else if(quaternion.w==4.0){


if(rotation.x!=0.0){ angle=time*rotation.x; }
if(rotation.y!=0.0){ angle+=rotation.y; }
vRotated=vec3(position.x*scale.x*cos(angle)-position.y*scale.y*sin(angle),position.y*scale.y*cos(angle)+position.x*scale.x*sin(angle),position.z);


vec3 vLook=quaternion.xyz-offset;
if(dot(vLook,vLook)==0.0){ vLook.z=1.0; }
vLook=normalize(vLook);
vec3 vRight=cross(up_vector,vLook);
if(dot(vRight,vRight)==0.0){
vLook.z+=0.0001;
vLook=normalize(vLook);
vRight=cross(up_vector,vLook);
}
vRight=normalize(vRight);
vec3 vUp=cross(vLook,vRight);
vPosition=vRight*vRotated.x+vUp*vRotated.y+vLook*vRotated.z;


}


// ПОВОРОТ К КАМЕРЕ. СТАНДАРТНЫЙ СПРАЙТ. МОЖНО ДЛЯ ДЫМА


else if(quaternion.w==5.0){


if(rotation.x!=0.0){ angle=time*rotation.x; }
if(rotation.y!=0.0){ angle+=rotation.y; }
vRotated=vec3(position.x*scale.x*cos(angle)-position.y*scale.y*sin(angle),position.y*scale.y*cos(angle)+position.x*scale.x*sin(angle),position.z);


vec3 cameraRight=vec3(viewMatrix[0].x,viewMatrix[1].x,viewMatrix[2].x);
vec3 cameraUp=vec3(viewMatrix[0].y,viewMatrix[1].y,viewMatrix[2].y);
vPosition=cameraRight*vRotated.x+cameraUp*vRotated.y;


}


// ПОВОРОТ К КАМЕРЕ. ПРИ СИЛЬНОМ ПРИБЛИЖЕНИИ ПОВОРАЧИВАЕТСЯ РЕЗКО. НЕ ДЛЯ ДЫМА


else if(quaternion.w==6.0){


if(rotation.x!=0.0){ angle=time*rotation.x; }
if(rotation.y!=0.0){ angle+=rotation.y; }
vRotated=vec3(position.x*scale.x*cos(angle)-position.y*scale.y*sin(angle),position.y*scale.y*cos(angle)+position.x*scale.x*sin(angle),position.z);


vec3 vLook=cameraPosition-offset;
if(dot(vLook,vLook)==0.0){ vLook.z=1.0; }
vLook=normalize(vLook);
vec3 vRight=cross(up_vector,vLook);
if(dot(vRight,vRight)==0.0){
vLook.z+=0.0001;
vLook=normalize(vLook);
vRight=cross(up_vector,vLook);
}
vRight=normalize(vRight);
vec3 vUp=cross(vLook,vRight);
vPosition=vRight*vRotated.x+vUp*vRotated.y+vLook*vRotated.z;


}


// ВВЕРХ ТЕКСТУРА. ЦИЛИНДРИЧЕСКИЙ ИЛИ ОСЕВОЙ СПРАЙТ ЛУЧЕЙ, ТРАССЕРОВ ПУЛЬ, ШЛЕЙФА ПУЛЬ


else if(quaternion.w==7.0){
vRotated=vec3(position.x*scale.x*cos(angle)-position.y*scale.y*sin(angle),position.y*scale.y*cos(angle)+position.x*scale.x*sin(angle),position.z);
mat3 rotation_matrix=mat3(normalize(cross(normalize(quaternion.xyz),normalize(cameraPosition-offset))),quaternion.xyz,normalize(offset-cameraPosition));
vPosition=rotation_matrix*vRotated;
}


// ВЛЕВО ТЕКСТУРА. ЦИЛИНДРИЧЕСКИЙ ИЛИ ОСЕВОЙ СПРАЙТ ЛУЧЕЙ, ТРАССЕРОВ ПУЛЬ, ШЛЕЙФА ПУЛЬ


else if(quaternion.w==8.0){
vRotated=vec3(-position.x*scale.y*cos(angle)-position.y*scale.x*sin(angle),position.y*scale.x*cos(angle)-position.x*scale.y*sin(angle),position.z);
mat3 rotation_matrix=mat3(normalize(cross(normalize(quaternion.xyz),normalize(cameraPosition-offset))),quaternion.xyz,normalize(offset-cameraPosition));
vPosition=rotation_matrix*vRotated.yxz;
}


// ВПРАВО ТЕКСТУРА. ЦИЛИНДРИЧЕСКИЙ ИЛИ ОСЕВОЙ СПРАЙТ ЛУЧЕЙ, ТРАССЕРОВ ПУЛЬ, ШЛЕЙФА ПУЛЬ


else if(quaternion.w==9.0){
vRotated=vec3(position.x*scale.y*cos(angle)+position.y*scale.x*sin(angle),-position.y*scale.x*cos(angle)+position.x*scale.y*sin(angle),position.z);
mat3 rotation_matrix=mat3(normalize(cross(normalize(quaternion.xyz),normalize(cameraPosition-offset))),quaternion.xyz,normalize(offset-cameraPosition));
vPosition=rotation_matrix*vRotated.yxz;
}


// ВНИЗ ТЕКСТУРА. ЦИЛИНДРИЧЕСКИЙ ИЛИ ОСЕВОЙ СПРАЙТ ЛУЧЕЙ, ТРАССЕРОВ ПУЛЬ, ШЛЕЙФА ПУЛЬ


else if(quaternion.w==10.0){
vRotated=vec3(-position.x*scale.x*cos(angle)+position.y*scale.y*sin(angle),-position.y*scale.y*cos(angle)-position.x*scale.x*sin(angle),position.z);
mat3 rotation_matrix=mat3(normalize(cross(normalize(quaternion.xyz),normalize(cameraPosition-offset))),quaternion.xyz,normalize(offset-cameraPosition));
vPosition=rotation_matrix*vRotated;
}


// БЛИКИ НАПРАВЛЕННЫХ ЛАМП ЧЕРЕЗ НОРМАЛЬ


else if(quaternion.w==11.0){


if(rotation.x!=0.0){ angle=time*rotation.x; }
if(rotation.y!=0.0){ angle+=rotation.y; }
vRotated=vec3(position.x*scale.x*cos(angle)-position.y*scale.y*sin(angle),position.y*scale.y*cos(angle)+position.x*scale.x*sin(angle),position.z);


vec3 vLook=cameraPosition-offset;
if(dot(vLook,vLook)==0.0){ vLook.z=1.0; }
vLook=normalize(vLook);
vec3 vRight=cross(up_vector,vLook);
if(dot(vRight,vRight)==0.0){
vLook.z+=0.0001;
vLook=normalize(vLook);
vRight=cross(up_vector,vLook);
}
vRight=normalize(vRight);
vec3 vUp=cross(vLook,vRight);
vPosition=vRight*vRotated.x+vUp*vRotated.y+vLook*vRotated.z;
float size_and_fade=lens_float(dot(quaternion.xyz,vLook),0.0,0.1);
vPosition*=size_and_fade;
vColor.w*=size_and_fade;


}


// БЛИКИ НАПРАВЛЕННЫХ ЛАМП ЧЕРЕЗ QUATERNION. QUATERNION.W ИМЕЕТ ИНТЕРВАЛ [-1,1], ПОЭТОМУ К 14 ПРИБАВЛЯЕМ ЗНАЧЕНИЕ QUATERNION.W. БУДЕТ ОТ 12.9 ДО 15.1


else if(quaternion.w>=12.9){


if(rotation.x!=0.0){ angle=time*rotation.x; }
if(rotation.y!=0.0){ angle+=rotation.y; }
vRotated=vec3(position.x*scale.x*cos(angle)-position.y*scale.y*sin(angle),position.y*scale.y*cos(angle)+position.x*scale.x*sin(angle),position.z);


vec3 v=vec3(0.0,0.0,1.0);
vec3 vcV=cross(quaternion.xyz,v);
vec3 normal=vcV*(2.0*(quaternion.w-14.0))+(cross(quaternion.xyz,vcV)*2.0+v);


vec3 vLook=cameraPosition-offset;
if(dot(vLook,vLook)==0.0){ vLook.z=1.0; }
vLook=normalize(vLook);
vec3 vRight=cross(up_vector,vLook);
if(dot(vRight,vRight)==0.0){
vLook.z+=0.0001;
vLook=normalize(vLook);
vRight=cross(up_vector,vLook);
}
vRight=normalize(vRight);
vec3 vUp=cross(vLook,vRight);
vPosition=vRight*vRotated.x+vUp*vRotated.y+vLook*vRotated.z;


float size_and_fade=lens_float(dot(normal,vLook),0.0,0.1);
vPosition*=size_and_fade;
vColor.w*=size_and_fade;


}
	
	
vec4 mvPosition=modelViewMatrix*vec4(vPosition+offset,1.0);
gl_Position=projectionMatrix*mvPosition;
vViewPosition=mvPosition.z;


}


`;


fs["sprite"]=`


uniform sampler2DArray map;
uniform sampler2D tDepth;
uniform mat4 projectionMatrix;
uniform vec2 screen_resolution;
varying vec2 vUv;
varying vec4 vColor;
varying float vBlend;
varying float vSoft;
varying vec4 vFrame;
varying float tex_num;
varying float vViewPosition;
out vec4 outColor;
	
	
void main(){


#ifdef solid


vec4 total=texture(map,vec3(vUv/vFrame.xy+vFrame.zw,tex_num));
if(total.a<0.5){ discard; }


outColor=total*vColor;


#else
	

outColor=texture(map,vec3(vUv/vFrame.xy+vFrame.zw,tex_num))*vColor;


#ifdef depth


float scene_depth=texture2D(tDepth,gl_FragCoord.xy/screen_resolution).r;
scene_depth=projectionMatrix[3][2]/((scene_depth*2.0-1.0)+projectionMatrix[2][2]);


float soft=clamp(scene_depth+vViewPosition,0.0,1.0);
soft=smoothstep(0.0,vSoft,soft);


outColor.rgb*=outColor.a*soft; // ДЛЯ ПРАВИЛЬНОГО ОТОБРАЖЕНИЯ
outColor.a*=vBlend*soft; // ЧЕМ МЕНЬШЕ, ТЕМ БОЛЬШЕ ADDITIVE. ЧЕМ ВЫШЕ, ТЕМ ГУЩЕ


#else


outColor.rgb*=outColor.a; // ДЛЯ ПРАВИЛЬНОГО ОТОБРАЖЕНИЯ
outColor.a*=vBlend; // ЧЕМ МЕНЬШЕ, ТЕМ БОЛЬШЕ ADDITIVE. ЧЕМ ВЫШЕ, ТЕМ ГУЩЕ


#endif


#endif


}


`;
