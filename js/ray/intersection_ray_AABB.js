// ____________________ ПЕРЕСЕЧЕНИЕ ЛУЧА И КУБА ____________________


/* 231020 5.36МС КУБЫ: 10.000*10=100.000
let min=9090;
for(let z=0;z<200;z++){
let started=performance.now();
for(let n=0;n<10000;n++){
let result=intersection_ray_AABB(player.position,player.direction,50,[mesh["home"],mesh["home"],mesh["home"],mesh["home"],mesh["home"],mesh["home"],mesh["home"],mesh["home"],mesh["home"],mesh["home"]]);
}
let elap=performance.now()-started;
if(min>elap){ min=elap; }
}
console.log(min);
*/


function intersection_ray_AABB(origin,direction,distance,array){


let result=0;
let originX=origin.x;
let originY=origin.y;
let originZ=origin.z;
let directionX=direction.x;
let directionY=direction.y;
let directionZ=direction.z;


let max=array.length
for(let n=0;n<max;n++){


let item=array[n];
let dirInverse={x:1/directionX,y:1/directionY,z:1/directionZ};
let position=item.position;
let boundingBox=item.geometry.boundingBox;


let bmin=boundingBox.min;
let bmax=boundingBox.max;
let positionX=position.x;
let positionY=position.y;
let positionZ=position.z;


let lbx=bmin.x+positionX,lby=bmin.y+positionY,lbz=bmin.z+positionZ;
let rtx=bmax.x+positionX,rty=bmax.y+positionY,rtz=bmax.z+positionZ;


let t1=(lbx-originX)*dirInverse.x;
let t2=(rtx-originX)*dirInverse.x;
let t3=(lby-originY)*dirInverse.y;
let t4=(rty-originY)*dirInverse.y;
let t5=(lbz-originZ)*dirInverse.z;
let t6=(rtz-originZ)*dirInverse.z;


let dmax=Math.min(Math.min(Math.max(t1,t2),Math.max(t3,t4)),Math.max(t5,t6));


// ЛУЧ ПЕРЕСЕКАЕТ, НО КУБ СЗАДИ ЛИБО ВООБЩЕ НЕ ПЕРЕСЕКАЕТ
if(dmax<0){ continue; }
let dmin=Math.max(Math.max(Math.min(t1,t2),Math.min(t3,t4)),Math.min(t5,t6));
if(dmin>dmax){ continue; }


let d=dmin;
// ЛУЧ ВНУТРИ КУБА, НО МИНИМАЛЬНАЯ ТОЧКА СЗАДИ, ПОЭТОМУ БЕРЁМ МАКСИМАЛЬНУЮ
if(dmin<0){ let d=dmax; }


// РАССТОЯНИЕ ПРЕВЫШАЕТ ДОПУСТИМОЕ ИЛИ РАССТОЯНИЕ БОЛЬШЕ, ЧЕМ НАЙДЕННОЕ РАННЕЕЕ
if(d>distance){ continue; }


distance=d;
result=d;


}


return result;


}


export{intersection_ray_AABB};
