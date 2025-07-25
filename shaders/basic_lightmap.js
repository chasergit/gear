vs["basic_lightmap"]=`


varying vec2 vUv;
attribute vec2 uv2;
varying vec2 vUv2;


void main(){


vUv=uv;
vUv2=uv2;


gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


}


`;


fs["basic_lightmap"]=`


uniform sampler2D map;
uniform sampler2D lightMap;
uniform sampler2D shadow_map;
varying vec2 vUv;
varying vec2 vUv2;
vec2 texSize=vec2(256.0,256.0);


vec3 bilinearFilter(){


vec2 texelSize=vec2(1.0)/texSize;
vec2 uvFloor=floor(vUv2*texSize);
vec2 uvFrac=fract(vUv2*texSize);
vec3 bottomLeft=texture2D(lightMap,uvFloor*texelSize).rgb;
vec3 bottomRight=texture2D(lightMap,(uvFloor+vec2(1.0,0.0))*texelSize).rgb;
vec3 topLeft=texture2D(lightMap,(uvFloor+vec2(0.0,1.0))*texelSize).rgb;
vec3 topRight=texture2D(lightMap,(uvFloor+vec2(1.0,1.0))*texelSize).rgb;
vec3 bottom=mix(bottomLeft,bottomRight,uvFrac.x);
vec3 top=mix(topLeft,topRight,uvFrac.x);
return mix(bottom,top,uvFrac.y);


}


vec3 bicubicFilter(){


vec2 iTc=vUv2;
iTc*=texSize;
vec2 tc=floor(iTc-0.5)+0.5;


vec2 f=iTc-tc;
vec2 f2=f*f;
vec2 f3=f2*f;
vec2 omf=1.0-f;
vec2 omf2=omf*omf;
vec2 omf3=omf2*omf;


vec2 w0=omf3/6.0;
vec2 w1=(4.0+3.0*f3-6.0*f2)/6.0;
vec2 w2=(4.0+3.0*omf3-6.0*omf2)/6.0;
vec2 w3=f3/6.0f;


vec2 s0=w0+w1;
vec2 s1=w2+w3;


vec2 f0=w1/(w0+w1);
vec2 f1=w3/(w2+w3);


vec2 t0=tc-1.0+f0;
vec2 t1=tc+1.0+f1;


t0/=texSize;
t1/=texSize;


return
texture2D(lightMap,vec2(t0.x,t0.y)).rgb*s0.x*s0.y+
texture2D(lightMap,vec2(t1.x,t0.y)).rgb*s1.x*s0.y+
texture2D(lightMap,vec2(t0.x,t1.y)).rgb*s0.x*s1.y+
texture2D(lightMap,vec2(t1.x,t1.y)).rgb*s1.x*s1.y;


}


void main(){


//vec3 lightMapTotal=texture2D(lightMap,vUv2).rgb; // 0.01 МС
//vec3 lightMapTotal=bilinearFilter(); // 0.02 МС
vec3 lightMapTotal=bicubicFilter();// 0.05 МС


// ДЛЯ HDR НЕ НАДО SRGB, Т.К. ОНО УЖЕ ЕСТЬ В НЁМ


float gamma=1.0; // ВЫРАВНИВАЕТ ТЁМНЫЕ ЦВЕТА. ДЛЯ КОНТРАСТНОСТИ, МОЖНО ПОСТАВИТЬ 0.42, 0.8
float exposure=1.0; // ВЛИЯЕТ НА ВИДИМОСТЬ ДЕТАЛЕЙ
float saturation=1.0; // НАСЫШЕННОСТЬ
float contrast=0.0; // КОНТРАСТНОСТЬ


float luminance=dot(lightMapTotal,vec3(0.2125,0.7154,0.0721));
vec3 intensity=vec3(luminance);
lightMapTotal=mix(intensity,lightMapTotal,saturation);
lightMapTotal=(lightMapTotal-0.5)/(1.0-contrast)+0.5;
lightMapTotal=pow(lightMapTotal,vec3(1.0/gamma))*exposure;


gl_FragColor=vec4(clamp(texture2D(map,vUv).rgb*lightMapTotal,0.0,1.0),1.0);
//gl_FragColor=vec4(clamp(lightMapTotal,0.0,1.0),1.0);
//gl_FragColor=vec4(texture2D(lightMap,vUv2).rgb,1.0);
//gl_FragColor=vec4(lightMapTotal,1.0);


/*
здесь на обратной стороне стены, если отключен приём теней, то стена блестит солнцем, а чтобы не блестела, надо на обратной стороне нормали отключать солнце именно, а другие лампочки оставлять
можно конечно и свой код нормали вставить
неверно. т.к. объект может быть в подвале и на его наружней стороне будет светить солнце. хотя если брать тень от sun, то может и норм, т.к. тень будет падать на него.
mesh["Box002"].material=new THREE.MeshStandardMaterial()
mesh["Box002"].material.map=tex["wall_237"];
mesh["Box002"].material.lightMap=RGBELoader.load("./textures/lightmap/Box002VRayRawTotalLightingMap.hdr?v="+Date.now());
mesh["Box002"].material.lightMap.channel=2;
//mesh["Box002"].material.envMap=tex["env_sunny"];
mesh["Box002"].material.normalMap=tex["wall_238_n"]
mesh["Box002"].material.normalScale={x:1,y:-1};
mesh["Box002"].material.lightMapIntensity=1;
mesh["Box002"].material.metalness=0.2;
mesh["Box002"].material.roughness=0.2;
mesh["Box002"].receiveShadow=true;
mesh["Box002"].castShadow=true;
mesh["Box002"].material.needsUpdate=true;


mesh["Box002"].material=new THREE.MeshLambertMaterial()
mesh["Box002"].material.map=tex["wall_118"];
mesh["Box002"].material.lightMap=RGBELoader.load("./textures/lightmap/Box002VRayRawTotalLightingMap.hdr?v="+Date.now());
mesh["Box002"].material.lightMap.channel=2;
mesh["Box002"].material.lightMapIntensity=3;
mesh["Box002"].receiveShadow=true;
mesh["Box002"].castShadow=true;
mesh["Box002"].material.needsUpdate=true;


mesh["Box002"].material=new THREE.MeshStandardMaterial()
mesh["Box002"].material.map=tex["wall_118"];
mesh["Box002"].material.lightMap=RGBELoader.load("./textures/lightmap/Box002VRayRawTotalLightingMap.hdr?v="+Date.now());
mesh["Box002"].material.lightMap.channel=2;
mesh["Box002"].material.lightMapIntensity=3;
mesh["Box002"].material.metalness=0;
mesh["Box002"].material.roughness=1;
mesh["Box002"].receiveShadow=true;
mesh["Box002"].castShadow=true;
mesh["Box002"].material.needsUpdate=true;


mesh["Box004"].material=new THREE.MeshStandardMaterial()
mesh["Box004"].material.map=tex["wall_237"];
mesh["Box004"].material.lightMap=RGBELoader.load("./textures/lightmap/Box004VRayRawTotalLightingMap.hdr?v="+Date.now());
mesh["Box004"].material.lightMap.channel=2;
//mesh["Box004"].material.envMap=tex["env_sunny"];
mesh["Box004"].material.normalMap=tex["wall_238_n"]
mesh["Box004"].material.normalScale={x:1,y:-1};
mesh["Box004"].material.lightMapIntensity=1;
mesh["Box004"].material.metalness=0.4;
mesh["Box004"].material.roughness=0.5;
mesh["Box004"].receiveShadow=true;
mesh["Box004"].castShadow=true;
mesh["Box004"].material.needsUpdate=true;


*/


}


`;