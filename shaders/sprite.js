vs["sprite"]=`


attribute vec3 offset;
attribute vec2 scale;
attribute vec4 quaternion;
attribute float rotation;
attribute vec4 color;
attribute float blend;
attribute vec4 frame;
attribute float texture;
varying vec2 vUv;
varying vec4 vColor;
varying float vBlend;
varying vec4 vFrame;
varying float tex_num;
uniform float time;
uniform vec3 cameraDirection;
uniform vec2 cameraAngle;
vec3 localUpVector=vec3(0.0,1.0,0.0);
varying float vViewPosition;


float normFloat(float n,float minVal,float maxVal){
return max(0.0,min(1.0,(n-minVal)/(maxVal-minVal)));
}


void main(){


float angle=time*rotation;
vec3 vRotated=vec3(position.x*scale.x*cos(angle)-position.y*scale.y*sin(angle),position.y*scale.y*cos(angle)+position.x*scale.x*sin(angle),position.z);


vUv=uv;
vColor=color;
vBlend=blend;
tex_num=texture;
vFrame=frame;


vec3 vPosition;


// ПОВОРОТ ПО QUATERNION


if(quaternion.w<2.0){
vec3 vcV=cross(quaternion.xyz,vRotated);
vPosition=vcV*(2.0*quaternion.w)+(cross(quaternion.xyz,vcV)*2.0+vRotated);
}


// ПОВОРОТ ЛИЦОМ К КАМЕРЕ. ДЛЯ СТАТИЧНОГО СПРАЙТА


else if(quaternion.w==2.0){


// ДЕФЕКТ: ЕСЛИ СПРАЙТ ВРАЩАЕТСЯ, ТО ПРИ ПОВОРОТЕ КАМЕРЫ СПРАЙТ КАК БЫ ЗАМИРАЕТ
// ТО ЕСТЬ ЛУЧШЕ ИСПОЛЬЗОВАТЬ ДЛЯ СТАТИЧНЫХ СПРАЙТОВ
vec3 cameraRight=vec3(viewMatrix[0].x,viewMatrix[1].x,viewMatrix[2].x);
vec3 cameraUp=vec3(viewMatrix[0].y,viewMatrix[1].y,viewMatrix[2].y);
vPosition=(cameraRight*vRotated.x)+(cameraUp*vRotated.y);


}


// ПОВОРОТ ЛИЦОМ К КАМЕРЕ. ДЛЯ СТАТИЧНОГО И ВРАЩАЕМОГО СПРАЙТА


else if(quaternion.w==3.0){
vec3 vLook=normalize(cameraPosition-offset);
vec3 vRight=normalize(cross(vLook,localUpVector));
vec3 vUp=normalize(cross(vLook,vRight));
vPosition=vRight*vRotated.x+vUp*vRotated.y+vLook*vRotated.z;
}


// ПОВОРОТ ЛИЦОМ К КАМЕРЕ ПО ОСИ Y. ТОЛЬКО ДЛЯ ВЕРТИКАЛЬНОГО, НЕ НАКЛОНЁННОГО СПРАЙТА


else if(quaternion.w==4.0){
vec3 vLook=offset-cameraPosition;
vec3 vRight=normalize(cross(vLook,localUpVector));
vPosition=vRotated.x*vRight+vRotated.y*localUpVector+vRotated.z;
}


// ПОВОРОТ ЛИЦОМ К ТОЧКЕ


else if(quaternion.w==5.0){
vec3 vLook=normalize(quaternion.xyz-offset);
vec3 vRight=normalize(cross(vLook,localUpVector));
vec3 vUp=normalize(cross(vLook,vRight));
vPosition=vRight*vRotated.x+vUp*vRotated.y+vLook*vRotated.z;
}


// ЦИЛИНДРИЧЕСКИЙ ИЛИ ОСЕВОЙ СПРАЙТ. МОЖНО НАКЛОНЯТЬ


else if(quaternion.w==6.0){
vec3 vLook=normalize(offset-cameraPosition);
vec3 xaxis=normalize(cross(vLook,quaternion.xyz));
vec3 zaxis=normalize(cross(xaxis,quaternion.xyz));
mat3 rotMatrix=mat3(vec3(xaxis.x,quaternion.x,zaxis.x),vec3(xaxis.y,quaternion.y,zaxis.y),vec3(xaxis.z,quaternion.z,zaxis.z));
vPosition=vec3(dot(rotMatrix[0],vRotated),dot(rotMatrix[1],vRotated),dot(rotMatrix[2],vRotated));
}


// БЛИКИ НАПРАВЛЕННЫХ ЛАМП


else if(quaternion.w==7.0){
vec3 vector=normalize(cameraPosition-offset);
float sized=dot(quaternion.xyz,vector);
sized=normFloat(sized,0.0,0.2);
vec3 vLook=normalize(cameraPosition-offset);
vec3 vRight=normalize(cross(vLook,localUpVector));
vec3 vUp=normalize(cross(vLook,vRight));
vPosition=vRight*vRotated.x+vUp*vRotated.y+vLook*vRotated.z;
vPosition*=sized;
vColor.w*=sized;
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
varying vec4 vFrame;
varying float tex_num;
varying float vViewPosition;
out vec4 outColor;
	
	
void main(){


outColor=texture(map,vec3(vUv/vFrame.xy+vFrame.zw,tex_num))*vColor;


#ifdef depth


float scene_depth=texture2D(tDepth,gl_FragCoord.xy/screen_resolution).r;
scene_depth=projectionMatrix[3][2]/((scene_depth*2.0-1.0)+projectionMatrix[2][2]);


float soft=clamp(scene_depth+vViewPosition,0.0,1.0);
soft=smoothstep(0.0,0.5,soft);


outColor.rgb*=outColor.a*soft; // ДЛЯ ПРАВИЛЬНОГО ОТОБРАЖЕНИЯ
outColor.a*=vBlend*soft; // ЧЕМ МЕНЬШЕ, ТЕМ БОЛЬШЕ ADDITIVE. ЧЕМ ВЫШЕ, ТЕМ ГУЩЕ


#else


outColor.rgb*=outColor.a; // ДЛЯ ПРАВИЛЬНОГО ОТОБРАЖЕНИЯ
outColor.a*=vBlend; // ЧЕМ МЕНЬШЕ, ТЕМ БОЛЬШЕ ADDITIVE. ЧЕМ ВЫШЕ, ТЕМ ГУЩЕ


#endif


}


`;
