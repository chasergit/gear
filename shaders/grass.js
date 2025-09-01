// ЗНАЧЕНИЕ ДЛЯ ОТСЕЧЕНИЯ АЛЬФАМАСКИ ДОЛЖНО БЫТЬ ТАКОЕ, ЧТОБЫ ПРИ НАБЛЮДЕНИИ НА ПЕРПЕНДИКУЛЯРНУЮ ПЛОСКОСТЬ НЕ БЫЛО БЕЛОЙ ПОЛОСЫ,
// КОГДА ТРЕУГОЛЬНИК ПОЧТИ ПОЛНОСТЬЮ СУЖЕН И РАВЕН 1 ПИКСЕЛЮ


vs["grass"]=`


attribute float scale;
attribute vec3 offset;
attribute vec4 orientation;
attribute vec3 color;
varying vec3 vViewPosition;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;
uniform float time;
uniform vec3 sun_direction;
varying vec2 shadowUv;
varying vec2 noise_uv_y;
varying float fogFactor;
varying float m;
varying float dec;
vec3 localUpVector=vec3(0.0,1.0,0.0);

uniform sampler2D noiseMap;
uniform sampler2D wind;


float noise_random_value(vec2 st){


return fract(sin(st.x*12.+st.y*15.)*19.);


}


float noise_get(vec2 st){


vec2 lv=fract(st);
vec2 id=floor(st);


lv=lv*lv*(3.0-2.0*lv);


float bl=noise_random_value(id);
float br=noise_random_value(id+vec2(1,0));
float b=mix(bl,br,lv.x);


float tl=noise_random_value(id+vec2(0,1));
float tr=noise_random_value(id+vec2(1,1));
float t=mix(tl,tr,lv.x);


return mix(b,t,lv.y);


}


void main(){


float distance_2d=distance(cameraPosition.xz,offset.xz);
if(distance_2d>150.0){ gl_Position=vec4(2.0,2.0,2.0,1.0); return; }


vPosition=position;
// ШИРОКАЯ ТРАВА
vPosition.y/=2.0;
vPosition*=2.0;
vPosition.y-=0.2; // УСАЖИВАЕМ ГЛУБЖЕ


vec3 vcV=cross(orientation.xyz,vPosition);
vPosition=vcV*(2.0*orientation.w)+cross(orientation.xyz,vcV)*2.0+vPosition;


vec3 vLook=offset-cameraPosition;
vec3 vRight=normalize(cross(vLook,localUpVector));
//vec3 vPosition=position.x*vRight+position.y*localUpVector+position.z;


float noise_value=0.0;


if(position.y>0.0){
	
	
// ДЛЯ УЧЁТА НАКЛОНА ПОВЕРХНОСТИ
/*
vec3 bbb=vec3(sin(time*0.75+cos(length(offset)))*0.5,0.0,cos(time*0.5+cos(length(offset)))*0.5);
vec3 noise_value=cross(orientation.xyz,bbb);
bbb=noise_value*(2.0*orientation.w)+cross(orientation.xyz,noise_value)*2.0+bbb;
vPosition.x+=bbb.x;
vPosition.z+=bbb.z;
*/

float power=1.0;


// ДОБАВЛЯЕМ ПОЗИЦИЮ ТРАВЫ, А ТАКЖЕ ДОБАВЛЯЕМ ПОЗИЦИЮ ВЕРШИНЫ, ЧТОБЫ БЫЛО РАЗНОЕ КОЛЫХАНИЕ, А НЕ КОПИРОВАЛО СОСЕДНЮЮ ТРАВУ
vec2 wind_pos=vPosition.xz+offset.xz+uv.y;


vec2 wind_uv=wind_pos*0.3+vec2(time*0.7*power,time*0.7*power);
float noise_value=noise_get(wind_uv);
// *noise_value ЧТОБЫ КОНТРАСТНЕЕ БЫЛ ВЕТЕР
float xx=(noise_value*2.0-1.0)*0.3*noise_value;


wind_uv=wind_pos*0.5+vec2(-time*0.6*power,-time*1.0*power);
noise_value=noise_get(wind_uv);
xx+=(noise_value*2.0-1.0)*0.05;


wind_uv=wind_pos*0.16+vec2(time*0.8*power,time*0.8*power);
noise_value=noise_get(wind_uv);
float zz=(noise_value*2.0-1.0)*0.4*noise_value;


wind_uv=wind_pos*0.5+vec2(time*0.6*power,time*1.0*power);
noise_value=noise_get(wind_uv);
zz+=(noise_value*2.0-1.0)*0.07;


// МИКРОКОЛЫХАНИЕ
float wind_micro_pos=(offset.x+offset.z+position.x+position.z)*4.4+time*3.0;
xx+=sin(wind_micro_pos)*0.012;
zz+=cos(wind_micro_pos)*0.027;


// ДЕЛАЕМ РАЗНЫЕ ВАРИАНТЫ НАКЛОНА ТРАВЫ
float xz_rnd=offset.x+offset.z+position.x+position.z;
xx+=((sin(xz_rnd/1.0))*2.0-1.0)*0.1;
zz+=((cos(xz_rnd/1.7))*2.0-1.0)*0.17;


// НОРМАЛИЗУЕМ, ЧТОБЫ ТРАВА НЕ РАСТЯГИВАЛАСЬ
vec3 ddd=normalize(vec3(xx,1.0/uv.y,zz))*uv.y;
vPosition.x+=ddd.x;
vPosition.z+=ddd.z;
// УМЕНЬШАЕМ ПО ВЫСОТЕ, ЧТОБЫ ТРАВА НЕ РАСТЯГИВАЛАСЬ
vPosition.y+=-uv.y+ddd.y;


}


// ТОЛЬКО СЕЙЧАС СТАВИТСЯ МАСШТАБ, ЧТОБЫ УВЕЛИЧИВАЯСЬ ПРИ ПРИБЛИЖЕНИИ, НЕ ДЁРГАЛОСЬ ОТ ВЕТРА


//if(distance_2d<95.0){ vPosition*=scale; }
//else{ vPosition*=scale*((100.0-distance_2d)/5.0); }

vPosition*=scale;
dec=1.0;
if(distance_2d>145.0){ dec=(150.0-distance_2d)/5.0; }


vPosition+=offset;


noise_uv_y=vec2((position.x+offset.x)*0.002,(position.z+offset.z)*0.002*-1.0)+0.5;
shadowUv=vec2(vPosition.x*0.002,vPosition.z*0.002*-1.0)+0.5;


vUv=uv;
//vColor=normalize(color);
//vColor=normalize(vec3(1.0)+(vec3(1.0+sin(vPosition.x)/1.0,1.0+sin(vPosition.y)/1.0,1.0+sin(vPosition.z)/1.0))/4.0);
vColor=texture2D(noiseMap,noise_uv_y).rgb;
//vColor=vec3(noise_value);


// ДЛЯ FXAA СГЛАЖИВАНИЯ
m=0.4;
if(distance_2d>2.0){
m=0.4-(distance_2d-2.0)/20.0;
if(m<0.1){ m=0.1; }
}


// ДЛЯ ПРОЗРАЧНОГО СЛУЧАЯ, ЧТОБЫ НЕ БЫЛО ВБЛИЗИ ПРОЗРАЧНЫХ ПИКСЕЛЕЙ, ЧЕРЕЗ КОТОРЫЕ ВИДНО ЛАНДШАФТ
// ОПТИМАЛЬНОЕ ЗНАЧЕНИЕ 0.9
m=0.9;
if(distance_2d>2.0){
m=0.9-(distance_2d-2.0)/20.0;
if(m<0.2){ m=0.2; }
}


vec4 mvPosition=modelViewMatrix*vec4(vPosition,1.0);
gl_Position=projectionMatrix*mvPosition;


vViewPosition=-mvPosition.xyz;
vPosition=(modelMatrix*vec4(vPosition,1.0)).xyz;


}


`;


fs["grass"]=`


uniform sampler2D map;
uniform sampler2D noiseMap;
uniform sampler2D shadowMap;
varying vec3 vViewPosition;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;
varying vec2 shadowUv;
varying vec2 noise_uv_y;
varying float fogFactor;
varying float m;
varying float dec;


vec3 lightPosition=vec3(60.0,20.0,60.0);
vec3 specular_color=vec3(1.0,0.87,0.65);


void main(){


vec4 diffuse=texture2D(map,vUv);


// ЧТОБЫ НЕ ОБРЕЗАЛО СИЛЬНО ПРОЗРАЧНЫЕ ПИКСЕЛИ И НЕ ВЫГЛЯДЕЛО ОГРЫЗКАМИ, ДЕЛАЕМ ИХ МЕНЕЕ ПРОЗРАЧНЫМИ
// И ТОГДА МОЖНО НЕ ДОБАВЛЯТЬ АНИЗОТРОПИЮ: tex["grass"].anisotropy=16;
// НО НЕЛЬЗЯ УВЕЛИЧИВАТЬ СИЛЬНО, ИНАЧЕ ВДАЛИ НЕ БУДУТ ПРОЗРАЧНЫМИ И БУДУТ СЛИШКОМ ВЫДЕЛЯТЬСЯ ОТ ЛАНДШАФТА, ВМЕСТО ТОГО, ЧТОБЫ СЛИВАТЬСЯ С НИМ
diffuse.a*=1.5;
if(diffuse.a<m){ discard; }


// ____________________ ЦВЕТ ЧЕРЕЗ ПЕРЕМЕННУЮ ___________________


diffuse.rgb*=vColor;


// ____________________ ЦВЕТ ЧЕРЕЗ ТЕКСТУРУ ___________________


/*
diffuse.rgb*=texture2D(noiseMap,noise_uv_y).rgb;
diffuse.rgb*=1.2; // ДЕЛАЕМ НЕМНОГО СВЕТЛЕЕ
diffuse.rgb*=texture2D(shadowMap,shadowUv).rgb;
*/


// ____________________ ЗАТЕНЕНИЕ ОСНОВАНИЯ ___________________


diffuse.rgb*=pow((vUv.y+0.2)*1.8,2.0);


// ____________________ КОНТРАСТНОСТЬ ___________________


diffuse.rgb=(diffuse.rgb-0.5)/(1.0-0.05)+0.5;


// ____________________ ТУМАН ___________________


/*
float depth=gl_FragCoord.z/gl_FragCoord.w;
float fogFactor=smoothstep(50.0,1000.0,depth);
diffuse.rgb=mix(diffuse.rgb,fogColor,fogFactor);
*/


// ПРИ ИСПОЛЬЗОВАНИИ EFFECTCOMPOSER, СЛИШКОМ НЕПРОЗРАЧНЫЕ ПИКСЕЛИ СТАНОВЯТСЯ ЧЁРНЫМИ, ПОЭТОМУ КОРРЕКТИРУЕМ
diffuse.a=min(diffuse.a,1.0);


// УМНОЖАЕМ НА 0.5, ЧТОБЫ ПЛАВНЕЕ БЫЛО ИСЧЕЗНОВЕНИЕ
if(dec<1.0 && length(diffuse.rgb*0.5)>dec){ discard; }


vec3 normal=vec3(0.0,1.0,0.0);


// ____________________ СОЛНЦЕ ___________________


float specular_fresnel_power=5.0;
float specular_intensity=0.05;


vec3 viewDir=normalize(cameraPosition-vPosition);
// РАСЧИТЫВАЕМ SPECULAR ПО BLINN PHONG WORLD SPACE
vec3 halfDir=normalize(viewDir+normalize(lightPosition));
// СТАВИМ max, ЧТОБЫ НЕ БЫЛО АРТЕФАКТОВ В ВИДЕ ЧЁРНЫХ ИЛИ БЕЛЫХ ПЯТЕН
float specular_fresnel=pow(max(0.0,dot(halfDir,normal)),specular_fresnel_power);
diffuse.rgb+=specular_fresnel*specular_color*specular_intensity;


gl_FragColor=diffuse;


// УДАЛИТЬ. ВРОДЕ БЕЗ ЭТОГО РАБОТАЕТ. ОБРЕЗАЕМ, ИНАЧЕ ЕСЛИ СМОТРЕТЬ ПОД ВОДОЙ, ТО ЗАСВЕЧИВАЕТ ТРАВУ В ДАЛЕКЕ.
//gl_FragColor.rgb=clamp(gl_FragColor.rgb,0.0,1.0);


}


`;


vs["grass_depth"]=`


attribute float scale;
attribute vec3 offset;
attribute vec4 orientation;
varying vec2 vUv;
uniform vec2 xz;
uniform float time;
vec3 localUpVector=vec3(0.0,1.0,0.0);
varying float dec;
varying vec2 vHighPrecisionZW;


void main(){


float distance_2d=distance(xz,offset.xz);
if(distance_2d>150.0){ gl_Position=vec4(0,0,-1,0); return; }

vec3 vPosition=position;
vPosition.xz/=1.0;
// ШИРОКАЯ ТРАВА
vPosition.y/=2.0;
vPosition*=2.0;
vPosition.y-=0.2;


vec3 vcV=cross(orientation.xyz,vPosition);
vPosition=vcV*(2.0*orientation.w)+cross(orientation.xyz,vcV)*2.0+vPosition;


vec3 vLook=offset-cameraPosition;
vec3 vRight=normalize(cross(vLook,localUpVector));
//vec3 vPosition=position.x*vRight+position.y*localUpVector+position.z;

/*
if(position.y>0.0){
float xx=sin(time*1.0+(offset.x+offset.z)/20.0)*0.2;
float zz=cos(time*0.8+(offset.x+offset.z)/20.0)*0.1;


vec3 ddd=normalize(vec3(xx,1.0/position.y,zz))*position.y;
vPosition.x+=ddd.x+sin(time*1.5+(offset.x+offset.z)/20.0)*0.02;
vPosition.z+=ddd.z+cos(time*0.8+(offset.x+offset.z)/20.0)*0.02;
vPosition.y+=-position.y+ddd.y;

}
*/

// ТОЛЬКО СЕЙЧАС СТАВИТСЯ МАСШТАБ, ЧТОБЫ УВЕЛИЧИВАЯСЬ ПРИ ПРИБЛИЖЕНИИ, НЕ ДЁРГАЛОСЬ ОТ ВЕТРА


vPosition*=scale;
dec=1.0;
if(distance_2d>145.0){ dec=(150.0-distance_2d)/5.0; }


vPosition+=offset;


// СТАВИМ ЧУТЬ ВЫШЕ, ИНАЧЕ НЕ БУДЕТ ВИДНО ТЕНИ, ЕСЛИ ОБЪЕКТ НАХОДИТСЯ ГЛУБОКО В ЗЕМЛЕ
vPosition.y+=0.5;


vUv=uv;


vec4 mvPosition=modelViewMatrix*vec4(vPosition,1.0);
gl_Position=projectionMatrix*mvPosition;
vHighPrecisionZW=gl_Position.zw;


}


`;


fs["grass_depth"]=`


uniform sampler2D map;
varying float dec;
varying vec2 vUv;
varying vec2 vHighPrecisionZW;
#include <packing>


void main(){


if(texture2D(map,vUv).a<0.4/dec){ discard; } // ЕСЛИ СТАВИТЬ 0.5, ТО ПРИ ОПРЕДЕЛЁННОМ УГЛЕ К СОЛНЦУ, ТЕНЬ ИСЧЕЗАЕТ
float fragCoordZ=0.5*vHighPrecisionZW[0]/vHighPrecisionZW[1]+0.5;
gl_FragColor=packDepthToRGBA(fragCoordZ);


}


`;
