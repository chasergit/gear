"use strict"


//____________________ ЗАГРУЗЧИК ТЕКСТУР И МОДЕЛЕЙ ____________________


let loader_textures_show=1; // 0 - НЕ ОТОБРАЖАТЬ СПИСОК ТЕКСТУР В КОНСОЛЕ, 1 - ОТОБРАЖАТЬ
let loader_models_show=1; // 0 - НЕ ОТОБРАЖАТЬ СПИСОК МОДЕЛЕЙ В КОНСОЛЕ, 1 - ОТОБРАЖАТЬ
let loader_sounds_show=1; // 0 - НЕ ОТОБРАЖАТЬ СПИСОК ЗВУКОВ В КОНСОЛЕ, 1 - ОТОБРАЖАТЬ


let loader_total=0; // СКОЛЬКО НАДО ЗАГРУЗИТЬ
let loader_loaded=0; // СКОЛЬКО ЗАГРУЖЕНО
let loader_textures_loaded=0; // СКОЛЬКО ЗАГРУЖЕНО ТЕКСТУР
let loader_models_loaded=0; // СКОЛЬКО ЗАГРУЖЕНО МОДЕЛЕЙ
let loader_sounds_loaded=0; // СКОЛЬКО ЗАГРУЖЕНО ЗВУКОВ
let loader_errors=0; // 0 - НЕТ ОШИБОК, 1 - ЕСТЬ


//____________________ МЕНЕДЖЕР ЗАГРУЗОК ____________________


let loadingManager=new THREE.LoadingManager();


loadingManager.onError=function(item,loaded,total){
loader_errors=1;
console.log("%c"+item,"font-weight:bold;color:#ff0000");
loadingManager=function(){};
}


//____________________ СЧЁТЧИК ЗАГРУЗОК ____________________


loadingManager.itemStart=function(item){
loader_total++;
}


loadingManager.onProgress=function(item,loaded,total){


let found=0;


if(item.match(/(\.jpe?g($|\?)|\.png($|\?)|\.gif($|\?)|\.bmp($|\?)|\.dds($|\?)|\.hdr($|\?))/gi)){
found=1;
loader_textures_loaded++;
if(loader_textures_show){ console.log("%c"+item,"font-weight:bold;color:#004090"); }
}


if(item.match(/(\.obj($|\?)|\.fbx($|\?)|\.gltf($|\?)|\.glb($|\?)|\.bin($|\?))/gi)){
found=1;
loader_models_loaded++;
if(loader_models_show){ console.log("%c"+item,"font-weight:bold;color:#448A44"); }
}


if(item.match(/(\.ogg($|\?)|\.mp3($|\?)|\.wav($|\?))/gi)){
found=1;
loader_sounds_loaded++;
if(loader_sounds_show){ console.log("%c"+item,"font-weight:bold;color:#A73CEE"); }
}


if(found==0){ console.log("%c ДОБАВИТЬ ФОРМАТ ЭТОГО ФАЙЛА: "+item+" ","background:#ff0000;color:#ffffff"); return; }


loader_loaded++;


};


//____________________ ЗАПУСКАЕМ ПРОВЕРКУ ЗАГРУЗКИ ФАЙЛОВ, КОГДА СТРАНИЦА ЗАГРУЗИТСЯ ПОЛНОСТЬЮ ____________________


document.addEventListener("DOMContentLoaded",()=>{
sounds_check();
loader_check();
});


//____________________ ПРОВЕРКА ЗАГРУЗКИ ФАЙЛОВ ____________________


function loader_check(){


document.getElementById("loading_amount").innerHTML=loader_loaded+"/"+loader_total;


if(loader_total==loader_loaded){
if(loader_errors){ document.getElementById("loading").innerHTML="Loading error"; }
else{
console.log("%c ТЕКСТУР: "+loader_textures_loaded+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c МОДЕЛЕЙ: "+loader_models_loaded+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c ЗВУКОВ: "+loader_sounds_loaded+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c ВСЕГО: "+loader_total+" ","background:#222;font-weight:bold;color:#bada55");
console.log("%c --> ВСЁ ЗАГРУЖЕНО <-- ","background:#222;font-weight:bold;color:#bada55;");
setTimeout(()=>{ init_core(); init_end(); },100);
}
return;
}


requestAnimationFrame(loader_check);


}


//____________________ ЗВУКИ ____________________


let sounds_total=0;


//____________________ ЗАГРУЗЧИК ЗВУКОВ ____________________


const sounds_loader=new THREE.FileLoader(loadingManager);
sounds_loader.setResponseType("arraybuffer");


function sounds_check(){
	
	
sounds_total=sounds_list.length;


for(let n=0;n<sounds_total;n++){


sounds_loader.load(sounds_list[n][1],function(buffer){
try{
const bufferCopy=buffer.slice(0);
sounds_context.decodeAudioData(bufferCopy,function(decoded_buffer){
sound[sounds_list[n][0]]=decoded_buffer;
});
}
catch(e){}
});


}


}
