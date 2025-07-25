vs["standard"]=`


varying vec2 vUv;
attribute vec2 uv2;
varying vec2 vUv2;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vLightDir;
varying float fogFactor;
varying vec3 vToEye;
varying vec3 vViewPosition;


void main(){


vPosition=position;


vec4 mvPosition=modelViewMatrix*vec4(vPosition,1.0);


// ТАКОЙ ТУМАН НЕ ИСЧЕЗАЕТ ВДАЛИ ПРИ ПОВОРОТЕ КАМЕРЫ
// И ДАЖЕ ПРИ ПОВОРОТЕ И СМЕЩЕНИИ ОБЪЕКТА ОТОБРАЖАЕТСЯ ПРАВИЛЬНО
fogFactor=smoothstep(50.0,800.0,length(mvPosition));


vToEye=cameraPosition-vPosition;
vViewPosition=-mvPosition.xyz;


vNormal=normalize(normalMatrix*normal);


vUv=uv;
vUv2=uv2;


gl_Position=projectionMatrix*mvPosition;


}


`;


fs["standard"]=`


uniform sampler2D map;
uniform vec2 mapRepeat;
uniform sampler2D normalMap;
uniform vec2 normalScale;
uniform vec2 normalRepeat;
uniform sampler2D specularMap;
uniform vec2 specularRepeat;
uniform sampler2D aoMap;
uniform float shininess;
uniform float glossiness;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vUv2;
varying vec3 vToEye;
varying vec3 vViewPosition;
varying float fogFactor;
uniform vec3 fogColor;
vec3 vLightDir=vec3(0.45,0.76,0.45);
vec3 light_color=vec3(0.99,0.87,0.49);
vec3 specular_color=vec3(0.99,0.87,0.49);
vec3 ambient=vec3(0.2,0.2,0.2);


vec3 inverseTransformDirection(in vec3 dir,in mat4 matrix){
return normalize((vec4(dir,0.0)*matrix).xyz);
}


vec3 perturbNormal2Arb(vec3 eye_pos,vec3 N,vec3 mapN){
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
return normalize(T*(mapN.x*scale)+B*(mapN.y*scale)+N*mapN.z);
}


void main(){


vec3 normal=texture2D(normalMap,vUv*normalRepeat).xyz*2.0-1.0;
normal.xy*=normalScale;
normal=perturbNormal2Arb(-vViewPosition,vNormal,normal);
normal=inverseTransformDirection(normal,viewMatrix);


vec3 lightDir=normalize(vLightDir);
vec3 viewDir=normalize(vToEye);


vec3 diffuse=texture2D(map,vUv*mapRepeat).rgb;
float lambert=max(0.0,dot(normal,lightDir));


vec3 final_color=ambient*diffuse+diffuse*light_color*lambert;


// РАСЧИТЫВАЕМ SPECULAR ПО BLINN PHONG WORLD SPACE
// ДЛЯ POINT LIGHT
//vec3 halfDir=normalize(viewDir+normalize(sun_direction-vPosition));
// ДЛЯ DIRECTIONAL LIGHT
vec3 halfDir=normalize(viewDir+lightDir);
// СТАВИМ max, ЧТОБЫ НЕ БЫЛО АРТЕФАКТОВ В ВИДЕ ЧЁРНЫХ ИЛИ БЕЛЫХ ПЯТЕН
float specular_fresnel=pow(max(0.0,dot(halfDir,normal)),shininess);
// БЛЕСК С ТЕКСТУРОЙ
//final_color+=texture2D(specularMap,vUv*specularRepeat).rgb*specular_fresnel*specular_color*glossiness;
final_color+=specular_fresnel*specular_color*glossiness;


// ЗАТУХАНИЕ СВЕТА БЕЗ УЧЁТА ТЕНЕЙ: РАССТОЯНИЕ/ИНТЕНСИВНОСТЬ
//final_color*=2.0/(distance(cameraPosition,vPosition)*distance(cameraPosition,vPosition))/1.0;


// ЗАТУХАНИЕ СВЕТА БЕЗ УЧЁТА ТЕНЕЙ: РАССТОЯНИЕ/ИНТЕНСИВНОСТЬ
//final_color*=max(0.0,(10.0-distance(cameraPosition,vPosition))/5.0);


/*
// ЗАТУХАНИЕ СВЕТА С УЧЁТОМ ТЕНЕЙ: РАССТОЯНИЕ/ИНТЕНСИВНОСТЬ
float attenuation=max(0.0,(10.0-distance(cameraPosition,vPosition))/10.0);
final_color*=attenuation;
final_color*=pow(texture2D(aoMap,vUv2).rgb,vec3(1.0-attenuation));
*/


//final_color=mix(final_color,fogColor,fogFactor);


gl_FragColor=vec4(final_color,1.0);


}


`;