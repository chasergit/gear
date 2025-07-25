// 220122 ДОБАВЛЕНО ЧАСТИЧНОЕ ОБНОВЛЕНИЕ ТЕКСТУРЫ, Т.К. ПРИ РАЗОВОМ ОБНОВЛЕНИИ ПАДАЕТ FPS ИЗ-ЗА ДОЛГОГО ОБНОВЛЕНИЯ


let shadow_ground_texture_size=1024; // РАЗМЕР ШИРИНЫ И ВЫСОТЫ ТЕКСТУРЫ В ПИКСЕЛЯХ
let shadow_ground_square=500; // РАЗМЕР ТЕКСТУРЫ В МЕТРАХ, Т.Е. РАЗМЕР ГЕОМЕТРИИ
let shadow_ground_border=Math.ceil(shadow_ground_texture_size/2048*10); // ТОЛЩИНА БЕЛОЙ РАМКИ В ПИКСЕЛЯХ. УБИРАЕТ РАСТЯЖЕНИЕ ТЁМНЫХ ПИКСЕЛЕЙ КОГДА ТЕКСТУРА НЕ УСПЕВАЕТ ОТОБРАЗИТЬСЯ
let shadow_ground_sleep=400; // СКОЛЬКО МИЛЛИСЕКУНД ОТДОХНУТЬ ПОСЛЕ ГЕНЕРАЦИИ, ЧТОБЫ НЕ БЫЛО СКАЧКОВ GPU
let shadow_ground_now=1; // КАКАЯ ИЗ ДВУХ ОСНОВЫХ ТЕКСТУР СЕЙЧАС ЗАДЕЙСТВОВАНА
let shadow_ground_texture;
let shadow_ground_texture_1;
let shadow_ground_texture_2;
let shadow_ground_tex;


// ТИПЫ ТЕНЕЙ. ЧТОБЫ ОТОБРАЗИТЬ ТОЧКУ НИЖЕ ЦЕНТРА, ДОБАВЛЯЕМ +shadow_ground_texture_size, ЧТОБЫ ВЫШЕ, ОТНИМАЕМ -shadow_ground_texture_size
let shadow_ground_type=[];


function shadow_ground_set_type(){
shadow_ground_type[1]=[0,0,1,50,2,140,0+shadow_ground_texture_size,0];
shadow_ground_type[1]=[
-1-shadow_ground_texture_size,100,-shadow_ground_texture_size,50,1-shadow_ground_texture_size,100,
-1,50,0,50,1,50,
-1+shadow_ground_texture_size,100,shadow_ground_texture_size,50,1+shadow_ground_texture_size,100
];
}


let shadow_ground_2_updated=1;
shadow_ground_set_type();


// ЕСЛИ ОБНОВЛЯТЬ ОГРОМНУЮ ТЕКСТУРУ РАЗОМ, ТО ПОЯВЛЯЕТСЯ СКАЧОК FPS, ПОЭТОМУ РАЗБИВАЕМ ТЕКСТУРУ НА ЧАСТИ И ОБНОВЛЯЕМ ПО ЧАСТЯМ
let shadow_ground_chunk_total=16; // НА СКОЛЬКО ЧАСТЕЙ РАЗДЕЛИТЬ ТЕКСТУРУ ПО ВЫСОТЕ. 1, 2, 4, 8, 16, 32. ТО ЕСТЬ 4096/16=256. 4096 В ШИРИНУ И 256 В ВЫСОТУ
let shadow_ground_chunk_now=0; // КАКАЯ ЧАСТЬ ТЕКСТУРЫ СЕЙЧАС ОБНОВЛЯЕТСЯ
let shadow_ground_chunk_pixels=shadow_ground_texture_size*(shadow_ground_texture_size/shadow_ground_chunk_total); // СКОЛЬКО ПИКСЕЛЕЙ В ОДНОЙ ЧАСТИ ТЕКСТУРЫ


let shadow_ground_pixel=Number((shadow_ground_texture_size/shadow_ground_square).toFixed(2));
// ВЫЧИСЛЯЕМ СКОЛЬКО САНТИМЕТРОВ ЗАНИМАЕТ 1 ПИКСЕЛЬ, ЧТОБЫ ОБЪЕКТЫ И ТЕНИ ОТ НИХ БЫЛИ ЧЁТКО ПО ЦЕНТРУ
// ОКРУГЛЯЕМ В МЕНЬШУЮ СТОРОНУ, ЧТОБЫ ТЕНЬ НЕ ВЫХОДИЛА ЗА ГРАНИЦЫ
let shadow_ground_start=0; // ВРЕМЯ НАЧАЛА ОТРИСОВКИ
let shadow_ground_end=0; // ВРЕМЯ ОКОНЧАНИЯ ОТРИСОВКИ ДЛЯ ПАУЗЫ
let shadow_ground_f=[]; // ФУНКЦИИ
let shadow_ground_m=0; // НОМЕР СЛЕДУЮЩЕЙ ФУНКЦИИИ
let shadow_ground_b=new Uint32Array(shadow_ground_texture_size*4*shadow_ground_border);
let shadow_ground_bn=0;
let shadow_ground_total=0;
let shadow_ground_pixels=0;
let shadow_ground_time_2=0;
let shadow_ground_time_3=0;
let shadow_ground_time_4=0;
let shadow_ground_breaks_2="";
let shadow_ground_breaks_3="";
let shadow_ground_breaks_4="";
let shadow_ground_breaks_5="";
let shadow_ground_breaks_6="";
let shadow_ground_w=0; // В КАКУЮ СТОРОНУ БЫЛ ПЕРЕХОД
let shadow_ground_px=-999; // ПРЕДУДЫЩИЙ СЕКТОР ПО X
let shadow_ground_pz=0; // ПРЕДУДЫЩИЙ СЕКТОР ПО Z
let shadow_ground_nx=0; // ТЕКУЩИЙ СЕКТОР ПО X
let shadow_ground_nz=0; // ТЕКУЩИЙ СЕКТОР ПО Z
let shadow_ground_mx=0; // СМЕЩЕНИЕ ПО X
let shadow_ground_mz=0; // СМЕЩЕНИЕ ПО Z
let shadow_ground_v=0;
let shadow_ground_n=0;
let shadow_ground_a=new Int32Array();
let shadow_ground_i=0;
let shadow_ground_a_num=0;


let shadow_ground_cell=[];


let shadow_ground_ways=[
[-4,-3],[-3,-3],[-2,-3],[-1,-3],[0,-3],[1,-3],[2,-3],[3,-3],
[-4,-2],[-3,-2],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[3,-2],
[-4,-1],[-3,-1],[-2,-1],[-1,-1],[0,-1],[1,-1],[2,-1],[3,-1],
[-4,0],[-3,0],[-2,0],[-1,0],[0,0],[1,0],[2,0],[3,0],
[-4,1],[-3,1],[-2,1],[-1,1],[0,1],[1,1],[2,1],[3,1],
[-4,2],[-3,2],[-2,2],[-1,2],[0,2],[1,2],[2,2],[3,2],
[-4,3],[-3,3],[-2,3],[-1,3],[0,3],[1,3],[2,3],[3,3],
[-4,4],[-3,4],[-2,4],[-1,4],[0,4],[1,4],[2,4],[3,4],
];


shadow_ground_ways=[
[-3,-2],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],
[-3,-1],[-2,-1],[-1,-1],[0,-1],[1,-1],[2,-1],
[-3,0],[-2,0],[-1,0],[0,0],[1,0],[2,0],
[-3,1],[-2,1],[-1,1],[0,1],[1,1],[2,1],
[-3,2],[-2,2],[-1,2],[0,2],[1,2],[2,2],
[-3,3],[-2,3],[-1,3],[0,3],[1,3],[2,3],
];


let shadow_ground_ways_max=shadow_ground_ways.length;


function shadow_ground_init(){


// МАССИВ РАМКИ


let n=0;
for(let i=0;i<shadow_ground_texture_size;i++){
for(let j=0;j<shadow_ground_border;j++){
shadow_ground_b[n]=i+j*shadow_ground_texture_size;
n++;
shadow_ground_b[n]=i+shadow_ground_texture_size+shadow_ground_texture_size*shadow_ground_texture_size-shadow_ground_texture_size*shadow_ground_border+j*shadow_ground_texture_size;
n++;
shadow_ground_b[n]=j+i*shadow_ground_texture_size;
n++;
shadow_ground_b[n]=j+shadow_ground_texture_size-shadow_ground_border+i*shadow_ground_texture_size;
n++;
}
}


// ОСТАВЛЯЕМ УНИКАЛЬНЫЕ ЗНАЧЕНИЯ


let r={};
shadow_ground_b=shadow_ground_b.filter(i=>r.hasOwnProperty(i)?!1:r[i]=!0);


shadow_ground_texture_1=new Uint8Array(shadow_ground_texture_size*shadow_ground_texture_size).fill(255);
shadow_ground_texture_2=new Uint8Array(shadow_ground_texture_size*shadow_ground_texture_size).fill(255);


tex["shadow_ground_1"]=new THREE.DataTexture(shadow_ground_texture_1,shadow_ground_texture_size,shadow_ground_texture_size,THREE.RedFormat,THREE.UnsignedByteType);
tex["shadow_ground_1"].minFilter=THREE.LinearMipmapLinearFilter;
tex["shadow_ground_1"].magFilter=THREE.LinearFilter;
//tex["shadow_ground_1"].minFilter=THREE.LinearFilter; // ПИКСЕЛИЗАЦИЯ
tex["shadow_ground_1"].generateMipmaps=true;
tex["shadow_ground_1"].flipY=true;
tex["shadow_ground_1"].needsUpdate=true;


tex["shadow_ground_2"]=new THREE.DataTexture(shadow_ground_texture_2,shadow_ground_texture_size,shadow_ground_texture_size,THREE.RedFormat,THREE.UnsignedByteType);
tex["shadow_ground_2"].minFilter=THREE.LinearMipmapLinearFilter;
tex["shadow_ground_2"].magFilter=THREE.LinearFilter;
//tex["shadow_ground_2"].minFilter=THREE.LinearFilter; // ПИКСЕЛИЗАЦИЯ
tex["shadow_ground_2"].generateMipmaps=true;
tex["shadow_ground_2"].flipY=true;
tex["shadow_ground_2"].needsUpdate=true;


tex["shadow_ground_chunk"]=new THREE.DataTexture(new Uint8Array(shadow_ground_chunk_pixels),shadow_ground_texture_size,shadow_ground_texture_size/shadow_ground_chunk_total,THREE.RedFormat,THREE.UnsignedByteType);
tex["shadow_ground_chunk"].minFilter=THREE.LinearFilter;
//tex["shadow_ground_chunk"].magFilter=THREE.LinearFilter;
tex["shadow_ground_chunk"].generateMipmaps=false;


shadow_ground_texture=shadow_ground_texture_1;
shadow_ground_tex=tex["shadow_ground_1"];


}


// ____________________ ПЕРЕХОД НА НОВЫЙ СЕКТОР ____________________


shadow_ground_f[0]=function(){


shadow_ground_nx=Math.floor(camera.position.x/62.5);
shadow_ground_nz=Math.floor(camera.position.z/62.5);


shadow_ground_w=0;


if(camera.position.x>shadow_ground_px*62.5+62.5+31.25){ shadow_ground_w=1; }
if(camera.position.z<shadow_ground_pz*62.5-31.25){ shadow_ground_w=2; }
if(camera.position.x<shadow_ground_px*62.5-62.5){ shadow_ground_w=3; }
if(camera.position.z>shadow_ground_pz*62.5+62.5){ shadow_ground_w=4; }
if(shadow_ground_w>0){ shadow_ground_m=1; }


}


// ____________________ ОБНОВЛЕНИЕ ДАННЫХ ____________________


shadow_ground_f[1]=function(){
debug_text.push(["shadow_ground_2","<font></font>SHADOW GENERATION"]);
shadow_ground_start=performance.now();
// ОЧИЩАЕМ ТЕКСТУРУ ОТ СТАРЫХ ТЕНЕЙ
shadow_ground_texture.fill(255);
// СМЕЩАЕМ ЦЕНТР КООРДИНАТ. ЗДЕСЬ 500 МЕТРОВ ЭТО 512 ПИКСЕЛЕЙ
shadow_ground_mx=-shadow_ground_nx*shadow_ground_texture_size/8+shadow_ground_texture_size/2;
shadow_ground_mz=-shadow_ground_nz*shadow_ground_texture_size/8+shadow_ground_texture_size/8*3;
// ЗАПОМИНАЕМ ТЕКУЩИЙ СЕКТОР
shadow_ground_px=shadow_ground_nx;
shadow_ground_pz=shadow_ground_nz;
shadow_ground_total=0;
shadow_ground_pixels=0;
shadow_ground_a_num=0;
shadow_ground_chunk_now=0;
shadow_ground_time_2=0;
shadow_ground_time_3=0;
shadow_ground_time_4=0;
shadow_ground_breaks_2="";
shadow_ground_breaks_3="";
shadow_ground_breaks_4="";
shadow_ground_breaks_5="";
shadow_ground_breaks_6="";
shadow_ground_m=2;


for(let n=0;n<shadow_ground_ways_max;n++){
let cell_name=(shadow_ground_px+shadow_ground_ways[n][0])+"_"+(shadow_ground_pz+shadow_ground_ways[n][1]);
let item=shadow_ground_cell[cell_name];
if(item!=undefined){ shadow_ground_total+=item.length; }
}


shadow_ground_a=new Int32Array(shadow_ground_total);
shadow_ground_total/=3;


}


// ____________________ ДОБАВЛЯЕМ ТЕНИ В МАССИВ ПОНЕМНОГУ С КАЖДЫМ КАДРОМ, А ЕСЛИ ВСЁ ЗА ОДИН КАДР, ТО FPS УПАДЁТ ____________________


shadow_ground_f[2]=function(){


let started=performance.now();


for(let n=shadow_ground_n;n<shadow_ground_ways_max;n++){


let cell_name=(shadow_ground_px+shadow_ground_ways[shadow_ground_n][0])+"_"+(shadow_ground_pz+shadow_ground_ways[shadow_ground_n][1]);


let item=shadow_ground_cell[cell_name];


if(item!=undefined){
let max=item.length;
for(let i=0;i<max;i++){
shadow_ground_a[i+shadow_ground_a_num]=item[i];
}
shadow_ground_a_num+=max;
}


shadow_ground_n=n+1;
// ЗДЕСЬ ЧЕМ МЕНЬШЕ, ТЕМ ЛУЧШЕ. ДОСТАТОЧНО 2
if(performance.now()-started>2){ shadow_ground_breaks_2+=(performance.now()-started).toFixed(1)+" "; break; }


}


shadow_ground_time_2+=performance.now()-started;


if(shadow_ground_n>shadow_ground_ways_max-1){
shadow_ground_n=0;
shadow_ground_m=3;
}


}


// ____________________ РАССТАВЛЯЕМ ТЕНИ ИЗ МАССИВА ____________________


shadow_ground_f[3]=function(){


let started=performance.now();


while(true){


let max_1=shadow_ground_i+250*3;
if(max_1>shadow_ground_a.length){
max_1=shadow_ground_a.length;
}


for(let n=shadow_ground_i;n<max_1;n+=3){
shadow_ground_v=shadow_ground_a[n]+shadow_ground_texture_size*shadow_ground_a[n+1]+shadow_ground_mx+shadow_ground_texture_size*shadow_ground_mz;
let data=shadow_ground_type[1];
let max_2=data.length;
for(let j=0;j<max_2;j+=2){
shadow_ground_texture[shadow_ground_v+data[j]]=data[j+1];
shadow_ground_pixels++;
}
}


if(max_1==shadow_ground_a.length){
shadow_ground_i=0;
shadow_ground_a=new Int32Array();
shadow_ground_m=4;
break;
}
else{
shadow_ground_i+=250*3;
}


if(performance.now()-started>5){ shadow_ground_breaks_3+=(performance.now()-started).toFixed(1)+" "; break; }


}


shadow_ground_time_3+=performance.now()-started;


}


// ____________________ ДОБАВЛЯЕМ БЕЛУЮ РАМКУ ПО КРАЯМ - ОЧИЩАЕМ ОТ ТЕНЕЙ, ЧТОБЫ НЕ БЫЛО ПОВТОРОВ ТЕНЕЙ В ВИДЕ ПОЛОСОК ____________________


shadow_ground_f[4]=function(){


let started=performance.now();


while(true){


let max=shadow_ground_bn+100000;
if(shadow_ground_bn+100000>shadow_ground_b.length){
max=shadow_ground_b.length;
}


for(let n=shadow_ground_bn;n<max;n++){
shadow_ground_texture[shadow_ground_b[n]]=255;
}


if(max==shadow_ground_b.length){
shadow_ground_bn=0;
shadow_ground_m=5;
break;
}
else{
shadow_ground_bn+=100000;
}


if(performance.now()-started>5){ shadow_ground_breaks_4+=(performance.now()-started).toFixed(1)+" "; break; }


}


shadow_ground_time_4+=performance.now()-started;


}


shadow_ground_f[5]=function(){


// БЕРЁМ ЧАСТЬ ТЕКСТУРЫ ИЗ ОДНОЙ ОСНОВНОЙ ТЕКСТУРЫ
let started=performance.now();
tex["shadow_ground_chunk"].image.data=shadow_ground_texture.slice(shadow_ground_chunk_now*shadow_ground_chunk_pixels,(shadow_ground_chunk_now+1)*shadow_ground_chunk_pixels);
shadow_ground_breaks_5+=(performance.now()-started).toFixed(1)+" ";


// ВСТАВЛЯЕМ ЭТУ ЧАСТЬ ТЕКСТУРЫ В ДРУГУЮ ОСНОВНУЮ ТЕКСТУРУ
started=performance.now();
renderer.copyTextureToTexture({x:0,y:shadow_ground_texture_size-shadow_ground_texture_size/shadow_ground_chunk_total-shadow_ground_chunk_now*shadow_ground_texture_size/shadow_ground_chunk_total},tex["shadow_ground_chunk"],shadow_ground_tex);
shadow_ground_breaks_6+=(performance.now()-started).toFixed(1)+" ";


shadow_ground_chunk_now++;


if(shadow_ground_chunk_now==shadow_ground_chunk_total){
shadow_ground_m=6;
}


}


// ____________________ СМЕЩАЕМ КООРДИНАТЫ В МАТЕРИАЛЕ И ОБНОВЛЯЕМ ТЕКСТУРУ ____________________


shadow_ground_f[6]=function(){


mat["terrain"].uniforms.shadow_ground_offset.value[0]=-shadow_ground_nx*0.125+0.5;
mat["terrain"].uniforms.shadow_ground_offset.value[1]=shadow_ground_nz*0.125-0.375;


if(shadow_ground_now==1){
shadow_ground_now=2;
shadow_ground_texture=shadow_ground_texture_1;
shadow_ground_tex=tex["shadow_ground_1"];
mat["terrain"].uniforms.shadow_ground_map.value=tex["shadow_ground_2"];
}
else{
shadow_ground_now=1;
shadow_ground_texture=shadow_ground_texture_2;
shadow_ground_tex=tex["shadow_ground_2"];
mat["terrain"].uniforms.shadow_ground_map.value=tex["shadow_ground_1"];
}


shadow_ground_m=7;
shadow_ground_end=performance.now();


}


// НЕМНОГО ПАУЗЫ ПЕРЕД СЛЕДУЮЩЕЙ ОТРИСОВКИ ТЕНЕЙ, ЧТОБЫ НЕ БЫЛО ПАДЕНИЯ FPS ИЗ-ЗА ЧАСТОЙ НАГРУЗКИ НА GPU ПРИ ОБНОВЛЕНИИ ТЕКСТУРЫ, ТАК КАК СОЗДАЮТСЯ MIPMAP
// ЭТО НА СЛУЧАЙ, ЕСЛИ ТЕНЕЙ БЫЛО МАЛО И СЛИШКОМ БЫСТРО ОТРИСВАЛО, ЛИБО БЫЛ БЫСТРЫЙ ПЕРЕХОД ПО СЕКТОРАМ


shadow_ground_f[7]=function(){


if(performance.now()-shadow_ground_end>shadow_ground_sleep){
let text="Shadow way: "+shadow_ground_w+" Shadow time: "+Math.ceil(shadow_ground_end-shadow_ground_start)+" "+"px "+shadow_ground_px+" pz "+shadow_ground_pz;
text+="<br>Grass: "+shadow_ground_total+" / "+total_grass+" | Pixels "+shadow_ground_pixels;
text+="<br>[2] "+shadow_ground_time_2.toFixed(2)+" Breaks: "+shadow_ground_breaks_2;
text+="<br>[3] "+shadow_ground_time_3.toFixed(2)+" Breaks: "+shadow_ground_breaks_3;
text+="<br>[4] "+shadow_ground_time_4.toFixed(2)+" Breaks: "+shadow_ground_breaks_4;
text+="<br>[5] "+shadow_ground_breaks_5;
text+="<br>[6] "+shadow_ground_breaks_6;
debug_text.push(["shadow_ground_1","<font></font>"+text]);
shadow_ground_m=0;
}


}
