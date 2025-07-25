// ____________________ ПЕРЕСЕЧЕНИЕ ЛУЧА И СФЕРЫ ____________________


/* 241020 3.19МС. СФЕРЫ: 10.000*10=100.000 ПЕРЕДЕЛАННО ИЗ СКРИПТА THREE.JS
let min=9090;
for(let z=0;z<200;z++){
let started=performance.now();
for(let n=0;n<10000;n++){
let result=intersection_ray_sphere(player.position,player.direction,50,[mesh["object_i_ray_sphere"],mesh["object_i_ray_sphere"],mesh["object_i_ray_sphere"],mesh["object_i_ray_sphere"],mesh["object_i_ray_sphere"],mesh["object_i_ray_sphere"],mesh["object_i_ray_sphere"],mesh["object_i_ray_sphere"],mesh["object_i_ray_sphere"],mesh["object_i_ray_sphere"]]);
}
let elap=performance.now()-started;
if(min>elap){ min=elap; }
}
console.log(min);
*/


function intersection_ray_sphere(origin,direction,distance,array){


let result=0;
let originX=origin.x;
let originY=origin.y;
let originZ=origin.z;
let directionX=direction.x;
let directionY=direction.y;
let directionZ=direction.z;


let max=array.length;
for(let n=0;n<max;n++){


let item=array[n];
let ig=item.geometry;
let ib=ig.boundingSphere;
let radius=ib.radius;
let position=item.position;
let sc=ib.center;


let ocx=position.x+sc.x-originX,ocy=position.y+sc.y-originY,ocz=position.z+sc.z-originZ;
let tca=ocx*directionX+ocy*directionY+ocz*directionZ;
let d2=ocx*ocx+ocy*ocy+ocz*ocz-tca*tca;
let radius_2=radius*radius;


if(d2>radius_2){ continue; }


let thc=Math.sqrt(radius_2-d2);
// t0 = ПЕРВАЯ ТОЧКА, КОТОРЫЙ ВХОДИТ В СФЕРУ
let t0=tca-thc;
// t1 = ВТОРАЯ ТОЧКА, КОТОРАЯ ВЫХОДИТ ИЗ СФЕРА
let t1=tca+thc;
// ЕСЛИ ОБЕ ТОЧКИ ЗА СФЕРОЙ
if(t0<0 && t1<0){ continue; }
// ЕСЛИ ПЕРВАЯ ТОЧКА ВПЕРЕДИ ЛУЧА, ТО БЕРЁМ ЕЁ
let d=t0;
// ЕСЛИ ЛУЧ ВНУТРИ СФЕРЫ, ТО БЕРЁМ ТОЛЬКО ВТОРУЮ ТОЧКУ, ТАК КАК ОНА ВПЕРЕДИ ЛУЧА, А ПЕРВАЯ ПОЗАДИ
if(t0<0){ d=t1; }


// РАССТОЯНИЕ ПРЕВЫШАЕТ ДОПУСТИМОЕ ИЛИ РАССТОЯНИЕ БОЛЬШЕ, ЧЕМ НАЙДЕННОЕ РАННЕЕЕ
if(d>distance){ continue; }


distance=d;
result=d;


}


return result;


}


export{intersection_ray_sphere};
