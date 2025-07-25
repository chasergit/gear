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
varying float vLight;
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


/*
vPosition=position;

wind_uv=wind_pos*0.3+vec2(time*0.7*power,time*0.3*power);
noise_value=noise_get(wind_uv);
xx=(noise_value*2.0-1.0)*0.6;


wind_uv=wind_pos*0.16+vec2(time*0.8*power,time*0.8*power);
noise_value=noise_get(wind_uv);
float yy=(noise_value*2.0-1.0)*0.4;


//float dist=distance(offset,offset+position);
//vec3 dir=normalize((offset+vPosition+vec3(xx,0.0,0.0))-(offset+position));
//vPosition+=dir*dist;

//float dist=distance(vec3(0.0,0.0,0.0),position);
//vec3 dir=normalize(position+vec3(xx,0.0,yy));
//vPosition=dir*dist;
*/
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
vLight=dot(normal,normalize(sun_direction));
if(vLight<0.2){ vLight=0.2; }


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


/*
// ДЛЯ MSAA СГЛАЖИВАНИЯ
//m=1.0+distance_2d/20.0; // КУСТЫ ТОЛСТЫЕ
m=1.0+distance_2d/10.0; // ДЕРЕВО ВЕТКИ ТОНКИЕ
*/


vec4 mvPosition=modelViewMatrix*vec4(vPosition,1.0);


// ТАКОЙ ТУМАН НЕ ИСЧЕЗАЕТ ВДАЛИ ПРИ ПОВОРОТЕ КАМЕРЫ
// И ДАЖЕ ПРИ ПОВОРОТЕ И СМЕЩЕНИИ ОБЪЕКТА ОТОБРАЖАЕТСЯ ПРАВИЛЬНО
//fogFactor=smoothstep(50.0,800.0,length(mvPosition));


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
varying float vLight;
varying vec2 shadowUv;
varying vec2 noise_uv_y;
varying float fogFactor;
varying float m;
varying float dec;


const vec3 lightPosition=vec3(60.0,100.0,60.0);
const vec3 ambientColor=vec3(0.2,0.0,0.0);
const vec3 diffuseColor=vec3(0.5,0.0,0.0);
const vec3 specularColor=vec3(1.0,0.87,0.65);


void main(){


// ALPHA TO COVERAGE ВЗЯТ ИЗ: https://bgolus.medium.com/anti-aliased-alpha-test-the-esoteric-alpha-to-coverage-8b177335ae4f
// MSAA ГЛАВНЫЙ ПЛЮС, ЧТО ПОЧТИ НЕ РЯБИТ ПРИ ДВИЖЕНИИ, В ОТЛИЧИИ ОТ FXAA


//vec4 diffuse=texture2D(map,gl_FragCoord.xy/vec2(1920.0,1080.0));
vec4 diffuse=texture2D(map,vUv);
// ЧТОБЫ НЕ ОБРЕЗАЛО СИЛЬНО ПРОЗРАЧНЫЕ ПИКСЕЛИ И НЕ ВЫГЛЯДЕЛО ОГРЫЗКАМИ, ДЕЛАЕМ ИХ МЕНЕЕ ПРОЗРАЧНЫМИ
// И ТОГДА МОЖНО НЕ ДОБАВЛЯТЬ АНИЗОТРОПИЮ ТЕКСТУРЕ
// НО НЕЛЬЗЯ УВЕЛИЧИВАТЬ СИЛЬНО, ИНАЧЕ ВДАЛИ НЕ БУДУТ ПРОЗРАЧНЫМИ И БУДУТ СЛИШКОМ ВЫДЕЛЯТЬСЯ ОТ ЛАНДШАФТА, ВМЕСТО ТОГО, ЧТОБЫ СЛИВАТЬСЯ С НИМ
diffuse.a*=1.5;
//ДЛЯ FXAA СГЛАЖИВАНИЯ
if(diffuse.a<m){ discard; }
//diffuse.a/=1.5;
//diffuse.a*=2.0;
diffuse.rgb*=vColor;
/*
diffuse.rgb*=texture2D(noiseMap,noise_uv_y).rgb;
diffuse.rgb*=1.2; // ДЕЛАЕМ НЕМНОГО СВЕТЛЕЕ
diffuse.rgb*=texture2D(shadowMap,shadowUv).rgb;
*/
diffuse.rgb*=2.0;
diffuse.rgb=(diffuse.rgb-0.5)/(1.0-0.05)+0.5;

//diffuse.rgb*=clamp((vUv.y+0.5)*2.0,0.0,1.2);
//diffuse.rgb=vec3(1.0);
//diffuse.rgb*=vUv.y*0.8+0.6;
//diffuse.rgb*=vUv.y+0.8;
//diffuse.rgb*=clamp(vUv.y+0.6,0.0,1.1);

// diffuse.rgb*=(vUv.y+СМЕЩЕНИЕ НАЧАЛАГРАДИЕНТА,ЧТОБЫ НЕ НАЧИНАЛОСЬ С ОЧЕНЬ ТЁМНОГО ЦВЕТА)*ИНТЕНСИВНОСТЬ;

diffuse.rgb*=(vUv.y+0.6)*1.0;
// ПРИ ИСПОЛЬЗОВАНИИ EFFECTCOMPOSER, СЛИШКОМ НЕПРОЗРАЧНЫЕ ПИКСЕЛИ СТАНОВЯТСЯ ЧЁРНЫМИ, ПОЭТОМУ КОРРЕКТИРУЕМ
if(diffuse.a>1.0){ diffuse.a=1.0; }
//diffuse.rgb*=clamp((vUv.y+0.25)*3.0,0.0,1.5); // ORIGIN
//float depth=gl_FragCoord.z/gl_FragCoord.w;
//float fogFactor=smoothstep(50.0,1000.0,depth);
//diffuse.rgb=mix(diffuse.rgb,vec3(0.55,0.7,0.77),fogFactor);

//vec3 fogColor=vec3(0.55,0.7,0.77);
//diffuse.rgb=mix(diffuse.rgb,fogColor,fogFactor);

if(dec<1.0){
// ЗДЕСЬ УМНОЖАЕМ НА 0.5, ЧТОБЫ ПЛАВНЕЕ БЫЛО ИСЧЕЗНОВЕНИЕ
if(length(diffuse.rgb*0.5)>dec){
discard;
}
}


vec3 fdx=vec3(dFdx(vViewPosition.x),dFdx(vViewPosition.y),dFdx(vViewPosition.z));
vec3 fdy=vec3(dFdy(vViewPosition.x),dFdy(vViewPosition.y),dFdy(vViewPosition.z));
vec3 normal=normalize(cross(fdx,fdy));
normal=vec3(0.0,1.0,0.0);

vec3 viewDir=normalize(cameraPosition-vPosition);
// РАСЧИТЫВАЕМ SPECULAR ПО BLINN PHONG WORLD SPACE
vec3 halfDir=normalize(viewDir+normalize(lightPosition));
float specular=pow(dot(halfDir,normal),5.0)*0.1;
diffuse.rgb+=specular*specularColor;


// ДЛЯ FXAA СГЛАЖИВАНИЯ
//gl_FragColor=vec4(1.0,0.0,0.0,1.0);
gl_FragColor=diffuse;
//gl_FragColor.rgb=clamp(gl_FragColor.rgb,0.0,1.0);

// ДЛЯ MSAA СГЛАЖИВАНИЯ, КОТОРОЕ ПО УМОЛЧАНИЮ
diffuse.a*=m;




/*
vec3 lightPosition=vec3(60.0,100.0,60.0);
vec3 specularColor=vec3(0.99,0.99,0.00);


vec3 viewDir=normalize(cameraPosition-vPosition);
vec3 halfDir=normalize(viewDir+normalize(lightPosition-vPosition));
float specular=pow(dot(halfDir,normal),60.0)*1.5;
diffuse.rgb+=specularColor*specular;
 */

	vec3 lightDir=normalize(lightPosition - vPosition);

	float lambertian=abs(max(dot(lightDir,normal), 0.0));
	specular=0.0;

	if(lambertian > 0.0) {
vec3 viewDir=normalize(-vPosition);
vec3 halfDir=normalize(lightDir + viewDir);
float specAngle=max(dot(halfDir, normal), 0.0);
specular=pow(specAngle, 20.0);
	}



//diffuse.rgb*=lambertian;
//diffuse.rgb=specularColor*specular;


// ДЛЯ ДЕРЕВЬЕВ +0.5
// ДЛЯ КУСТОВ И ВЕТОК +0.3
//gl_FragColor=vec4(diffuse.rgb,(diffuse.a-0.4)/max(fwidth(diffuse.a),0.0001)+0.5);

// ОБРЕЗАЕМ, ИНАЧЕ ЕСЛИ СМОТРЕТЬ ПОД ВОДОЙ, ТО ЗАСВЕЧИВАЕТ ТРАВУ В ДАЛЕКЕ.
gl_FragColor.rgb=clamp(gl_FragColor.rgb,0.0,1.0);


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
