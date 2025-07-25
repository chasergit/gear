"use strict"


/*
160721 СТАРТ РАЗРАБОТКИ
160821 ПЕРВАЯ ВЕРСИЯ
020424 ТЕПЕРЬ ПЕРЕДАЧА ВСЕХ ПАРАМЕТРОВ ОБЯЗАТЕЛЬНА, ЧТОБЫ НЕ ПУТАТЬСЯ
210424 ДОБАВЛЕН DynamicsCompressor. ПОМОГАЕТ УБРАТЬ ГРОМКИЙ ЗВУК, КОГДА ИГРАЮТ НЕСКОЛЬКО ЗВУКОВ ОДНОВРЕМЕННО
220424 УДАЛОСЬ УМЕНЬШИТЬ ЗАНИМАЕМУЮ ОПЕРАТИВНУЮ ПАМЯТЬ ПРИ ИСПОЛЬЗОВАНИИ ЭФФЕКТОВ CONVOLVER С СИЛОЙ СМЕШИВАНИЯ С ОБЫЧНЫМ ЗВУКОМ.
НАПРИМЕР, НАДО БЫЛО 100 ЗВУКОВ ВЫСТРЕЛОВ С ЭФФЕКТОМ ЭХА. ЕСЛИ СОЗДАВАТЬ 100 ОТДЕЛЬНЫХ ЭФФЕКТОВ CONVOLVER ЭХО, ТО ЭТО ОКОЛО 1ГБ ПАМЯТИ.
А ЕСЛИ СОЗДАТЬ ОДИН ЭФФЕКТ ЭХО И ПРОСТО К НЕМУ ПРИСОЕДИНЯТЬ 100 РЕГУЛЯТОРОВ ГРОМКОСТИ, ТО 10МБ.


ЗАПУСК ОДНОГО ЗВУКА С ЭФФЕКТОМ И БЕЗ ЗАНИМАЕТ 0.10 МС, 10 ЗВУКОВ 0.50 МС, 20 ЗВУКОВ 0.90 МС
НО ЭТО ЕСЛИ ОДНОВРЕМЕННО ЗАПУСТИТЬ ВСЕ 20 ЗВУКОВ, А Т.К. ЭТО МАЛОВЕРОЯТНО, ТО НОРМАЛЬНО.
disconnect ЗАНИМАЕТ 0 МС
ПРИ СОЗДАНИИ НОВОЙ ФУНКЦИИ НЕ ЗАБЫВАТЬ ОЧИЩАТЬ delete music_fade_in[name]; delete music_fade_out[name]; delete sounds_fade_in[name]; delete sounds_fade_out[name];
*/


let music_speed=1; // ОБЩАЯ СКОРОСТЬ МУЗЫКИ
let sounds_speed=1; // ОБЩАЯ СКОРОСТЬ ЗВУКОВ
let music_status=1; // 0 - НА ПАУЗЕ, 1 - РАБОТАЕТ
let sounds_status=1; // 0 - НА ПАУЗЕ, 1 - РАБОТАЕТ


// ДАННЫЕ


let sound=[]; // ЗВУКИ В БУФЕРЕ
let music=[]; // МУЗЫКА ВОСПРОИЗВОДИМАЯ СЕЙЧАС
let music_fade_in=[]; // МУЗЫКА С ПЛАВНЫМ ВХОДОМ
let music_fade_out=[]; // МУЗЫКА С ПЛАВНЫМ ВЫХОДОМ
let sounds_fade_in=[]; // ЗВУК С ПЛАВНЫМ ВХОДОМ
let sounds_fade_out=[]; // ЗВУК С ПЛАВНЫМ ВЫХОДОМ
let sounds=[]; // ЗВУКИ ВОСПРОИЗВОДИМЫЕ СЕЙЧАС
let sound_n=0; // СЧЁТЧИК ЗВУКОВ ДЛЯ СОЗДАНИЯ РАЗНЫХ ИМЁН ЗВУКОВ
let music_effect=[]; // ЭФФЕКТЫ ДЛЯ МУЗЫКИ
let sound_effect=[]; // ЭФФЕКТЫ ДЛЯ ЗВУКОВ


// КОНТЕКСТ


window.AudioContext=window.AudioContext || window.webkitAudioContext;
let sounds_context=new AudioContext();
let sounds_destination=sounds_context.destination;
let sounds_listener=sounds_context.listener;


// ОБЩИЕ ГРОМКОСТИ


let menu_volume=sounds_context.createGain();
menu_volume.gain.value=1; // ОБЩАЯ ГРОМКОСТЬ МЕНЮ
menu_volume.connect(sounds_destination);
let music_volume=sounds_context.createGain();
music_volume.gain.value=1; // ОБЩАЯ ГРОМКОСТЬ МУЗЫКИ
music_volume.connect(sounds_destination);
let sounds_volume=sounds_context.createGain();
sounds_volume.gain.value=1; // ОБЩАЯ СКОРОСТЬ ЗВУКОВ
const compressor = sounds_context.createDynamicsCompressor();
/*
compressor.threshold.setValueAtTime(-50, sounds_context.currentTime);
compressor.knee.setValueAtTime(40, sounds_context.currentTime);
compressor.ratio.setValueAtTime(12, sounds_context.currentTime);
compressor.attack.setValueAtTime(0, sounds_context.currentTime);
compressor.release.setValueAtTime(0.25, sounds_context.currentTime);
*/
/*
compressor.threshold.setValueAtTime(-5.0,sounds_context.currentTime); // In Decibels
compressor.knee.setValueAtTime(0,sounds_context.currentTime); // In Decibels
compressor.ratio.setValueAtTime(40.0, sounds_context.currentTime);  // In Decibels
compressor.attack.setValueAtTime(0.001, sounds_context.currentTime); // Time is seconds
compressor.release.setValueAtTime(0.1, sounds_context.currentTime); // Time is seconds
*/
/*
compressor.threshold.value = -50; // Порог срабатывания
compressor.knee.value = 40; // Мягкий/жесткий режим компрессии
compressor.ratio.value = 12; // Отношение компрессии
compressor.attack.value = 0.003; // Время нарастания
compressor.release.value = 0.25; // Время спада
*/
compressor.connect(sounds_destination);
//sounds_volume.connect(sounds_destination);
sounds_volume.connect(compressor);


// СОЗДАЁМ ЗАРАНЕЕ ФИЛЬТР И ГРОМКОСТИ, ЧТОБЫ КАЖДЫЙ РАЗ НЕ СОЗДАВАТЬ И БЫЛО МЕНЬШЕ СКАЧКОВ FPS


let sounds_biquad_i=[];
let sounds_panner_i=[];
let sounds_volume_f=[];
let sounds_volume_i=[];
let sounds_volume_n=0;


function sounds_volume_gen(amount){


let max=sounds_volume_n+amount;
for(let n=sounds_volume_n;n<max;n++){
sounds_biquad_i[n]=sounds_context.createBiquadFilter();
sounds_biquad_i[n].type="lowpass";
sounds_volume_i[n]=sounds_context.createGain();
sounds_volume_i[n].volume=1;
sounds_volume_i[n].gain.value=1;
sounds_panner_i[n]=sounds_context.createPanner();
sounds_panner_i[n].panningModel="HRTF";
sounds_panner_i[n].connect(sounds_volume_i[n]);
sounds_volume_f.push(n);
sounds_volume_n++;
}


}


// СОЗДАЁМ ЭФФЕКТЫ ЗАРАНЕЕ, Т.К. СОЗДАНИЕ ОДНОГО ЭФФЕКТА ЗАНИМАЕТ 1-30 МС


function music_effects_gen(){


for(let n=0;n<sounds_total;n++){
let item=sounds_list[n];
if(item[1].match(/sounds\/effects/)){
music_effect[item[0]]=sounds_context.createConvolver();
music_effect[item[0]].buffer=sound[item[0]];
music_effect[item[0]].connect(music_volume);
}
}


}


function sounds_effects_gen(){


for(let n=0;n<sounds_total;n++){
let item=sounds_list[n];
if(item[1].match(/sounds\/effects/)){
sound_effect[item[0]]=sounds_context.createConvolver();
sound_effect[item[0]].buffer=sound[item[0]];
sound_effect[item[0]].connect(sounds_volume);
}
}


}


// ____________________ ОБНОВЛЕНИЕ СЛУШАТЕЛЯ 3D ____________________


function sounds_listener_update(){


let p=camera.matrixWorld.elements,q=camera.quaternion,qx=q.x,qy=q.y,qz=q.z,qw=q.w; 
sounds_listener.positionX.value=p[12];
sounds_listener.positionY.value=p[13];
sounds_listener.positionZ.value=p[14];
sounds_listener.forwardX.value=-qy*qw+qz*-qx+qx*-qz+qw*-qy;
sounds_listener.forwardY.value=qx*qw+qz*-qy-qw*-qx+qy*-qz;
sounds_listener.forwardZ.value=-qw*qw+qz*-qz-qy*-qy-qx*-qx;


}


// ____________________ ОБНОВЛЕНИЕ ОРИЕНТАЦИИ ЗВУКА 3D ____________________


// 100 ОБНОВЛЕНИЙ ЗА 0.8МС, 50 ЗА 0.4МС, 20 ЗА 0.2МС, 10 ЗА 0.1МС


function sounds_panner_update(item,sound_panner){


let p=item.matrixWorld.elements,q=item.quaternion,qx=q.x,qy=q.y,qz=q.z,qw=q.w;  
sound_panner.positionX.value=p[12];
sound_panner.positionY.value=p[13];
sound_panner.positionZ.value=p[14];  
sound_panner.orientationX.value=qy*qw-qz*-qx-qx*-qz-qw*-qy;
sound_panner.orientationY.value=-qx*qw-qz*-qy+qw*-qx-qy*-qz;
sound_panner.orientationZ.value=qw*qw-qz*-qz+qy*-qy+qx*-qx;


}


// ____________________ ИЗМЕНЕНИЕ ОБЩЕГО УРОВНЯ ГРОМКОСТИ МЕНЮ ____________________


function menu_volume_set(v){


menu_volume.gain.setTargetAtTime(Number(v),sounds_context.currentTime,0.01);


}


// ____________________ ВОСПРОИЗВЕСТИ ЗВУК В МЕНЮ ____________________


function menu_play(track,volume,speed){


// track - КАКОЙ ЗВУК ВОСПРОИЗВЕСТИ
// volume - ГРОМКОСТЬ // speed - СКОРОСТЬ ВОСПРОИЗВЕДЕНИЯ


let menu_sound=sounds_context.createBufferSource();
menu_sound.buffer=sound[track];
menu_sound.playbackRate.value=speed;
menu_sound.gain_i=sounds_context.createGain();
menu_sound.gain_i.gain.value=volume;
menu_sound.gain_i.connect(menu_volume);
menu_sound.connect(menu_sound.gain_i);
menu_sound.onended=function(){ this.disconnect(); this.gain_i.disconnect(); this.gain_i=null; }
menu_sound.start();


}


// ____________________ ИЗМЕНЕНИЕ ОБЩЕЙ ГРОМКОСТИ МУЗЫКИ ____________________


function music_volume_set(v){


music_volume.gain.setTargetAtTime(Number(v),sounds_context.currentTime,0.01);


}


// ____________________ ИЗМЕНЕНИЕ ОБЩЕЙ СКОРОСТИ МУЗЫКИ ____________________


function music_speed_set(v){


music_speed=Number(v);


for(let name in music){
try{ music[name].playbackRate.value=music[name].speed*music_speed; }
catch(e){}
}


}


// ____________________ ВОСПРОИЗВЕСТИ МУЗЫКУ ____________________


function music_play(name,track,loop,effect,speed,detune,volume){


// name - ИМЯ МУЗЫКИ МОЖНО УКАЗАТЬ СВОЁ, ЛИБО null
// track - КАКУЮ МУЗЫКУ ВОСПРОИЗВЕСТИ
// loop - БЕСКОНЕЧНЫЙ ЗВУК true ИЛИ ОДНОРАЗОВЫЙ false
// effect - НАЗВАНИЕ ЭФФЕКТА, ЛИБО false
// speed - СКОРОСТЬ // detune - ТОНАЛЬНОСТЬ // volume - ГРОМКОСТЬ 

sound_n++;
let name_c;
if(name==null){ name_c=track+"_"+sound_n; }
else{ name_c=name; music_delete_fast(name); }
music[name_c]=sounds_context.createBufferSource();
let item=music[name_c];
item.buffer=sound[track];
item.loop=loop;
item.speed=speed;
item.detune.value=detune;
item.playbackRate.value=speed*music_speed*music_status;
item.gain_i=sounds_context.createGain();
item.gain_i.gain.value=volume;
item.volume=volume;
if(effect){
item.gain_i.connect(music_effect[effect]);
}
else{
item.gain_i.connect(music_volume);
}
item.connect(item.gain_i);
// onended СРАБАТЫВАЕТ ПРИ stop() И ПРИ ОКОНЧАНИИ ЗВУКА И ПРИ ЗНАЧЕНИИ start(999) БОЛЬШЕ ДЛИТЕЛЬНОСТИ ЗВУКА
item.onended=function(){
try{
delete music_fade_in[name_c];
delete music_fade_out[name_c];
music[name_c].disconnect();
music[name_c].gain_i.disconnect();
music[name_c].gain_i=null;
delete music[name_c];
}
catch(e){}
}
item.start();
return name_c;


}


// ____________________ ПОСТАВИТЬ НА ПАУЗУ ОДНУ МУЗЫКУ ИЛИ ВСЮ ____________________


function music_pause(name){


if(name){
try{ music[name].playbackRate.value=0; return true; }
catch(e){ return false; }
}
else{
music_status=0;
for(let name in music){
try{ music[name].playbackRate.value=0; }
catch(e){}
}
}


}


// ____________________ ВОЗОБНОВИТЬ ОДНУ МУЗЫКУ ИЛИ ВСЮ ____________________


function music_resume(name){


if(name){
try{ music[name].playbackRate.value=music[name].speed*music_speed; return true; }
catch(e){ return false; }
}
else{
music_status=1;
for(let name in music){
try{ music[name].playbackRate.value=music[name].speed*music_speed; }
catch(e){}
}
}


}


// ____________________ УДАЛИТЬ ОДНУ МУЗЫКУ ИЛИ ВСЮ - СРАЗУ И, ВОЗМОЖНО, С ХРИПОМ ____________________


function music_delete_fast(name){


if(name){
try{ delete music_fade_in[name]; delete music_fade_out[name]; music[name].onended=null; music[name].stop(); music[name].disconnect(); music[name].gain_i.disconnect(); music[name].gain_i=null; delete music[name]; return true; }
catch(e){ return false; }
}
else{
music_fade_in=[];
music_fade_out=[];
for(let name in music){
try{ music[name].onended=null; music[name].stop(); music[name].disconnect(); music[name].gain_i.disconnect(); music[name].gain_i=null; delete music[name]; }
catch(e){}
}
}


}


// ____________________ УДАЛИТЬ ОДНУ МУЗЫКУ ИЛИ ВСЮ - МЕДЛЕННО И БЕЗ ХРИПА ____________________


function music_delete_slow(name,time){


// name - ИМЯ МУЗЫКИ ИЗ МАССИВА music. ЛИБО "all" - ВСЕ
// time - ЗА КАКОЕ ВРЕМЯ ВЫПОЛНИТЬ В СЕКУНДАХ. ЛИБО ОСТАВИТЬ ПУСТЫМ, ТОГДА ПО УМОЛЧАНИЮ ВРЕМЯ 0.01 СЕКУНДЫ


if(time<0.01){ time=0.01; }
if(name!="all"){
try{
delete music_fade_in[name];
delete music_fade_out[name];
music[name].gain_i.gain.setTargetAtTime(0,sounds_context.currentTime,time);
music[name].stop(sounds_context.currentTime+time);
return true;
}
catch(e){ return false; }
}
else{
music_fade_in=[];
music_fade_out=[];
for(let name in music){
try{
music[name].gain_i.gain.setTargetAtTime(0,sounds_context.currentTime,time);
music[name].stop(sounds_context.currentTime+time);
}
catch(e){}
}
}


}


// ____________________ ПЛАВНЫЙ ВХОД МУЗЫКИ ____________________


function music_fade_in_set(name,time,volume,speed){


// name - НАЗВАНИЕ МУЗЫКИ ИЗ МАССИВА music, ЛИБО "all" - ВСЕ
// time - ЗА КАКОЕ ВРЕМЯ ВЫПОЛНИТЬ В МИЛЛИСЕКУНДАХ. ЕСЛИ ПОЯВИЛСЯ ХРИП, ТО СТАВИТЬ БОЛЬШЕ
// volume - ПЛАВНЫЙ ВХОД ДО УКАЗАННОЙ ГРОМКОСТИ, ЛИБО -1, Т.Е. МУЗЫКА БЫЛА ПРИОСТАНОВЛЕНА И ТЕПЕРЬ НАДО ВЕРНУТЬ ГРОМКОСТЬ ТУ ЖЕ, ЧТО И БЫЛА
// speed - СКОРОСТЬ

if(name!="all"){
if(!music[name]){ return false; }
try{
music[name].speed=speed;
music[name].playbackRate.value=speed*music_speed*music_status;
}
catch(e){}
delete music_fade_in[name];
delete music_fade_out[name];
music_fade_in[name]={};
let item=music_fade_in[name];
item.time_total=time;
item.time_elapsed=0;
try{
item.volume_first=music[name].volume;
item.volume_in=volume-item.volume_first;
item.volume_to=volume;
if(volume<item.volume_first){ item.volume_in=0; }
if(volume==-1){ item.volume_in=item.volume_first; item.volume_first=0; item.volume_to=item.volume_in; }
return true;
}
catch(e){ delete music_fade_in[name]; return false; }
}
else{
music_fade_in=[];
music_fade_out=[];
for(let name in music){
try{
music[name].speed=speed;
music[name].playbackRate.value=speed*music_speed*music_status;
}
catch(e){}
music_fade_in[name]={};
let item=music_fade_in[name];
item.time_total=time;
item.time_elapsed=0;
try{
item.volume_first=music[name].volume;
item.volume_in=volume-item.volume_first;
item.volume_to=volume;
if(volume<item.volume_first){ item.volume_in=0; }
if(volume==-1){ item.volume_in=item.volume_first; item.volume_first=0; item.volume_to=item.volume_in; }
}
catch(e){ delete music_fade_in[name]; }
}
}


}


function music_fade_in_update(){


for(let name in music_fade_in){


let item=music_fade_in[name];
item.time_elapsed+=delta;
let volume=item.volume_first+item.volume_in*(item.time_elapsed/item.time_total);
if(volume>item.volume_to){ volume=item.volume_to; }
if(item.time_elapsed>=item.time_total){ volume=item.volume_to; delete music_fade_in[name]; }
try{
music[name].volume=volume;
music[name].gain_i.gain.value=volume;
}
catch(e){}


}


}


// ____________________ ПЛАВНЫЙ ВЫХОД МУЗЫКИ ____________________


function music_fade_out_set(name,time,action){


// name - НАЗВАНИЕ МУЗЫКИ ИЗ МАССИВА music, ЛИБО "all" - ВСЕ
// time - ЗА КАКОЕ ВРЕМЯ ВЫПОЛНИТЬ В МИЛЛИСЕКУНДАХ. ЕСЛИ ПОЯВИЛСЯ ХРИП, ТО СТАВИТЬ БОЛЬШЕ
// action - ДЕЙСТВИЕ В КОНЦЕ: 0 - НИЧЕГО, 1 - ПОСТАВИТЬ НА ПАУЗУ, 2 - УДАЛИТЬ 

if(name!="all"){
if(!music[name]){ return false; }
delete music_fade_in[name];
delete music_fade_out[name];
music_fade_out[name]={};
let item=music_fade_out[name];
item.time_total=time;
item.time_elapsed=0;
item.action=action;
try{ item.volume=music[name].volume; return true; }
catch(e){ delete music_fade_out[name]; return false; }
}
else{
music_fade_in=[];
music_fade_out=[];
for(let name in music){
music_fade_out[name]={};
let item=music_fade_out[name];
item.time_total=time;
item.time_elapsed=0;
item.action=action;
try{ item.volume=music[name].volume; }
catch(e){ delete music_fade_out[name]; }
}
}

}


function music_fade_out_update(){


for(let name in music_fade_out){


let item=music_fade_out[name];
item.time_elapsed+=delta;
let volume=item.volume*(1-item.time_elapsed/item.time_total);
if(0>volume){ volume=0; }
try{
music[name].volume=volume;
music[name].gain_i.gain.value=volume;
}
catch(e){}
if(item.time_elapsed>=item.time_total){
delete music_fade_out[name];
if(item.action==1){ music[name].playbackRate.value=0; }
if(item.action==2){ music_delete_fast(name); }
}


}


}


// ____________________ ИЗМЕНЕНИЕ ОБЩЕЙ ГРОМКОСТИ ЗВУКОВ ____________________


function sounds_volume_set(v){


sounds_volume.gain.setTargetAtTime(Number(v),sounds_context.currentTime,0.01);


}


// ____________________ ИЗМЕНЕНИЕ ОБЩЕЙ СКОРОСТИ ЗВУКОВ ____________________


function sounds_speed_set(v){


sounds_speed=Number(v);


for(let name in sounds){
try{ sounds[name].playbackRate.value=sounds[name].speed*sounds_speed; }
catch(e){}
}


}


// ____________________ ВОСПРОИЗВЕСТИ 2D ИЛИ 3D ЗВУК ____________________


function sounds_play(name,track,loop,effect,speed,detune,volume,frequency,type,distance,object,coneInnerAngle,coneOuterAngle,coneOuterGain,refDistance,rolloffFactor){


// name - ИМЯ ЗВУКА МОЖНО УКАЗАТЬ СВОЁ, ЛИБО null
// track - КАКОЙ ЗВУК ВОСПРОИЗВЕСТИ
// loop - БЕСКОНЕЧНЫЙ ЗВУК true ИЛИ ОДНОРАЗОВЫЙ false
// effect - НАЗВАНИЕ ЭФФЕКТА, ЛИБО false
// speed - СКОРОСТЬ // detune - ТОНАЛЬНОСТЬ, НАПРИМЕР, ДЛЯ ЗВУКА ЗА СТЕНОЙ ИЛИ ВДАЛИ
// volume - ГРОМКОСТЬ // frequency - ЧАСТОТА, НАПРИМЕР, ДЛЯ ЗВУКА ЗА СТЕНОЙ ИЛИ ВДАЛИ. ЕСЛИ НЕ ПЛАНИРУЕТСЯ ИЗМЕНЯТЬ, ТО false
// object - ДЛЯ 3D ЗВУКА ПЕРЕДАЁМ MESH ИЛИ ЕГО ПОДОБИЕ. ЕСЛИ 2D, ТО false
// coneInnerAngle - ВНУТРЕННИЙ УГОЛ. ПО УМОЛЧАНИЮ 360
// coneOuterAngle - ВНЕШНИЙ УГОЛ, КОГДА НАХОДИШЬСЯ ПОЗАДИ ЗВУЧАЩЕГО ОБЪЕКТА. ПО УМОЛЧАНИЮ 360
// coneOuterGain - УРОВЕНЬ ГРОМКОСТИ ВНЕШНЕГО УГЛА, КОГДА НАХОДИШЬСЯ ПОЗАДИ ЗВУЧАЩЕГО ОБЪЕКТА - У ВНЕШНЕГО УГЛА. 0-1. ПО УМОЛЧАНИЮ 0
// refDistance - ДИСТАНЦИЯ, НАЧИНАЯ С КОТОРОЙ, ЗВУК БУДЕТ УМЕНЬШАТЬСЯ. ПО УМОЛЧАНИЮ 1
// rolloffFactor - НА СКОЛЬКО БЫСТРО ДОЛЖНА УМЕНЬШАТЬСЯ ГРОМКОСТЬ ЗВУКА, НАЧИНАЯ С ДИСТАНЦИИ refDistance. ПО УМОЛЧАНИЮ 1


sound_n++;
let name_c;
if(name==null){ name_c=track+"_"+sound_n; }
else{ name_c=name; sounds_delete_fast(name); }
sounds[name_c]=sounds_context.createBufferSource();
let item=sounds[name_c];
item.buffer=sound[track];
item.loop=loop;
item.speed=speed;
item.detune.value=detune;
item.playbackRate.value=speed*sounds_speed*sounds_status;
let volume_n=sounds_volume_f.pop();
if(volume_n==undefined){ sounds_volume_gen(10); volume_n=sounds_volume_f.pop(); console.log("Few sounds_volume_f. Changed to: "+sounds_volume_n); }
let volume_g=sounds_volume_i[volume_n];
volume_g.volume=volume;
volume_g.gain.value=volume;


if(effect){


if(frequency===false){
volume_g.connect(sound_effect[effect]);
}
else{ 
sounds_biquad_i[volume_n].connect(sound_effect[effect]);
volume_g.connect(sounds_biquad_i[volume_n]);
}


}
else{


if(frequency===false){
volume_g.connect(sounds_volume);
}
else{ 
sounds_biquad_i[volume_n].connect(sounds_volume);
volume_g.connect(sounds_biquad_i[volume_n]);
}


}


if(frequency!==false){ sounds_biquad_i[volume_n].frequency.value=frequency; }


if(object){
let panner=sounds_panner_i[volume_n];
panner.coneInnerAngle=coneInnerAngle;
panner.coneOuterAngle=coneOuterAngle;
panner.coneOuterGain=coneOuterGain;
panner.refDistance=refDistance;
panner.rolloffFactor=rolloffFactor;
// СРАЗУ ОБНОВЛЯЕМ ПОЗИЦИЮ ЗВУКА
sounds_panner_update(object,panner);
item.connect(panner);
}
else{
item.connect(volume_g);
}


item.n=volume_n;
// onended СРАБАТЫВАЕТ ПРИ stop() И ПРИ ОКОНЧАНИИ ЗВУКА И ПРИ ЗНАЧЕНИИ start(999) БОЛЬШЕ ДЛИТЕЛЬНОСТИ ЗВУКА
item.onended=function(){
try{
delete sounds_fade_in[name_c];
delete sounds_fade_out[name_c];
sounds[name_c].disconnect();
sounds_volume_i[sounds[name_c].n].disconnect();
sounds_biquad_i[sounds[name_c].n].disconnect();
sounds_volume_f.push(sounds[name_c].n);
delete sounds[name_c];
}
catch(e){}
}
item.start();
return name_c;


}


// ____________________ ПОСТАВИТЬ НА ПАУЗУ ОДИН ЗВУК ИЛИ ВСЕ ____________________


function sounds_pause(name){


if(name){
try{ sounds[name].playbackRate.value=0; return true; }
catch(e){ return false; }
}
else{
sounds_status=0;
for(let name in sounds){
try{ sounds[name].playbackRate.value=0; }
catch(e){}
}
}


}


// ____________________ ВОЗОБНОВИТЬ ОДИН ЗВУК ИЛИ ВСЕ ____________________


function sounds_resume(name){


if(name){
try{ sounds[name].playbackRate.value=sounds[name].speed*sounds_speed; return true; }
catch(e){ return false; }
}
else{
sounds_status=1;
for(let name in sounds){
try{ sounds[name].playbackRate.value=sounds[name].speed*sounds_speed;}
catch(e){}
}
}


}


// ____________________ УДАЛИТЬ ОДИН ЗВУК ИЛИ ВСЕ - СРАЗУ И, ВОЗМОЖНО, С ХРИПОМ ____________________


function sounds_delete_fast(name){


if(name){
try{ delete sounds_fade_in[name]; delete sounds_fade_out[name]; sounds[name].onended=null; sounds[name].stop(); sounds[name].disconnect(); sounds_volume_i[sounds[name].n].disconnect(); sounds_volume_f.push(sounds[name].n); delete sounds[name]; return true; }
catch(e){ return false; }
}
else{
sounds_fade_in=[];
sounds_fade_out=[];
for(let name in sounds){
try{ sounds[name].onended=null; sounds[name].stop(); sounds[name].disconnect(); sounds_volume_i[sounds[name].n].disconnect(); sounds_volume_f.push(sounds[name].n); delete sounds[name]; }
catch(e){}
}
}


}


// ____________________ УДАЛИТЬ ОДИН ЗВУК ИЛИ ВСЕ - МЕДЛЕННО И БЕЗ ХРИПА ____________________


function sounds_delete_slow(name,time){


// name - ИМЯ ЗВУКА ИЗ МАССИВА sounds. ЛИБО "all" - ВСЕ
// time - ЗА КАКОЕ ВРЕМЯ ВЫПОЛНИТЬ В СЕКУНДАХ. ЛИБО ОСТАВИТЬ ПУСТЫМ, ТОГДА ПО УМОЛЧАНИЮ ВРЕМЯ 0.01 СЕКУНДЫ


if(time<0.01){ time=0.01; }
if(name!="all"){
try{
delete sounds_fade_in[name];
delete sounds_fade_out[name];
sounds_volume_i[sounds[name].n].gain.setTargetAtTime(0,sounds_context.currentTime,time);
sounds[name].stop(sounds_context.currentTime+time);
return true;
}
catch(e){ return false; }
}
else{
sounds_fade_in=[];
sounds_fade_out=[];
for(let name in sounds){
try{
sounds_volume_i[sounds[name].n].gain.setTargetAtTime(0,sounds_context.currentTime,time);
sounds[name].stop(sounds_context.currentTime+time);
}
catch(e){}
}
}


}


// ____________________ ПЛАВНЫЙ ВХОД ЗВУКА ____________________


function sounds_fade_in_set(name,time,volume,speed){


// name - НАЗВАНИЕ ЗВУКА ИЗ МАССИВА sounds, ЛИБО "all" - ВСЕ
// time - ЗА КАКОЕ ВРЕМЯ ВЫПОЛНИТЬ В МИЛЛИСЕКУНДАХ. ЕСЛИ ПОЯВИЛСЯ ХРИП, ТО СТАВИТЬ БОЛЬШЕ
// volume - ПЛАВНЫЙ ВХОД ДО УКАЗАННОЙ ГРОМКОСТИ, ЛИБО -1, Т.Е. ЗВУК БЫЛ ПРИОСТАНОВЛЕН И ТЕПЕРЬ НАДО ВЕРНУТЬ ГРОМКОСТЬ ТУ ЖЕ, ЧТО И БЫЛА
// speed - СКОРОСТЬ 

if(name!="all"){
if(!sounds[name]){ return false; }
try{
sounds[name].speed=speed;
sounds[name].playbackRate.value=speed*sounds_speed*sounds_status;
}
catch(e){}
delete sounds_fade_in[name];
delete sounds_fade_out[name];
sounds_fade_in[name]={};
let item=sounds_fade_in[name];
item.time_total=time;
item.time_elapsed=0;
try{
item.volume_first=sounds_volume_i[sounds[name].n].volume;
item.volume_in=volume-item.volume_first;
item.volume_to=volume;
if(volume<item.volume_first){ item.volume_in=0; }
if(volume==-1){ item.volume_in=item.volume_first; item.volume_first=0; item.volume_to=item.volume_in; }
return true;
}
catch(e){ delete sounds_fade_in[name]; return false; }
}
else{
sounds_fade_in=[];
sounds_fade_out=[];
for(let name in sounds){
try{
sounds[name].speed=speed;
sounds[name].playbackRate.value=speed*sounds_speed*sounds_status;
}
catch(e){}
sounds_fade_in[name]={};
let item=sounds_fade_in[name];
item.time_total=time;
item.time_elapsed=0;
try{
item.volume_first=sounds_volume_i[sounds[name].n].volume;
item.volume_in=volume-item.volume_first;
item.volume_to=volume;
if(volume<item.volume_first){ item.volume_in=0; }
if(volume==-1){ item.volume_in=item.volume_first; item.volume_first=0; item.volume_to=item.volume_in; }
}
catch(e){ delete sounds_fade_in[name]; }
}
}


}


function sounds_fade_in_update(){


for(let name in sounds_fade_in){


let item=sounds_fade_in[name];
item.time_elapsed+=delta;
let volume=item.volume_first+item.volume_in*(item.time_elapsed/item.time_total);
if(volume>item.volume_to){ volume=item.volume_to; }
if(item.time_elapsed>=item.time_total){ volume=item.volume_to; delete sounds_fade_in[name]; }
try{
sounds_volume_i[sounds[name].n].volume=volume;
sounds_volume_i[sounds[name].n].gain.value=volume;
}
catch(e){}


}


}


// ____________________ ПЛАВНЫЙ ВЫХОД ЗВУКА ОДНОГО ИЛИ ВСЕХ ____________________


function sounds_fade_out_set(name,time,action){


// name - НАЗВАНИЕ ЗВУКА ИЗ МАССИВА sounds, ЛИБО "all" - ВСЕ
// time - ЗА КАКОЕ ВРЕМЯ ВЫПОЛНИТЬ В МИЛЛИСЕКУНДАХ. ЕСЛИ ПОЯВИЛСЯ ХРИП, ТО СТАВИТЬ БОЛЬШЕ
// action - ДЕЙСТВИЕ В КОНЦЕ: 0 - НИЧЕГО, 1 - ПОСТАВИТЬ НА ПАУЗУ, 2 - УДАЛИТЬ 

if(name!="all"){
if(!sounds[name]){ return false; }
delete sounds_fade_in[name];
delete sounds_fade_out[name];
sounds_fade_out[name]={};
let item=sounds_fade_out[name];
item.time_total=time;
item.time_elapsed=0;
item.action=action;
try{ item.volume=sounds_volume_i[sounds[name].n].volume; return true; }
catch(e){ delete sounds_fade_out[name]; return false; }
}
else{
sounds_fade_in=[];
sounds_fade_out=[];
for(let name in sounds){
sounds_fade_out[name]={};
let item=sounds_fade_out[name];
item.time_total=time;
item.time_elapsed=0;
item.action=action;
try{ item.volume=sounds_volume_i[sounds[name].n].volume; }
catch(e){ delete sounds_fade_out[name]; }
}
}

}


function sounds_fade_out_update(){


for(let name in sounds_fade_out){


let item=sounds_fade_out[name];
item.time_elapsed+=delta;
let volume=item.volume*(1-item.time_elapsed/item.time_total);
if(0>volume){ volume=0; }
try{
sounds_volume_i[sounds[name].n].volume=volume;
sounds_volume_i[sounds[name].n].gain.value=volume;
}
catch(e){}
if(item.time_elapsed>=item.time_total){
delete sounds_fade_out[name];
if(item.action==1){ sounds[name].playbackRate.value=0; }
if(item.action==2){ sounds_delete_fast(name); }
}


}


}