// ____________________ ПЕРЕСЕЧЕНИЕ ЛУЧА И ТРЕУГОЛЬНИКА ДВУХСТОРОННЕЕ ____________________


/* 241020 200МС ТРЕУГОЛЬНИКОВ 5426. ПЕРЕДЕЛАННО ИЗ СКРИПТА THREE.JS
let min=9090;
for(let z=0;z<20;z++){
let started=performance.now();
for(let n=0;n<1000;n++){
let result=intersection_ray_triangle(player.position,player.direction,Infinity,[mesh["terrain"].geometry.attributes]);
}
let elap=performance.now()-started;
if(min>elap){ min=elap; }
}
console.log(min);
*/


function intersection_ray_triangle(origin,direction,distance,item){


let result=0;
let originX=origin.x;
let originY=origin.y;
let originZ=origin.z;
let directionX=direction.x;
let directionY=direction.y;
let directionZ=direction.z;


let max_1=item.length;


for(let j=0;j<max_1;j++){


let p=item[j].position;
let vp=p.array;
let max_2=p.count*3;


for(let i=0;i<max_2;i+=9){


let ax=vp[i],ay=vp[i+1],az=vp[i+2];
let bx=vp[i+3],by=vp[i+4],bz=vp[i+5];
let cx=vp[i+6],cy=vp[i+7],cz=vp[i+8];


let bax=bx-ax,bay=by-ay,baz=bz-az;
let cax=cx-ax,cay=cy-ay,caz=cz-az;


let normalX=bay*caz-baz*cay;
let normalY=baz*cax-bax*caz;
let normalZ=bax*cay-bay*cax;


let DdN=directionX*normalX+directionY*normalY+directionZ*normalZ;


let sign;


// ОБРАТНАЯ СТОРОНА ТРЕУГОЛЬНИКА
if(DdN>0){
sign=1;
}
 // ПЕРЕДНЯЯ СТОРОНА ТРЕУГОЛЬНИКА
else if(DdN<0){
sign=-1;
DdN=-DdN;
}
// ЛУЧ ПАРАЛЛЕЛЕН ТРЕУГОЛЬНИКУ
else{ continue; }


let diffX=originX-ax,diffY=originY-ay,diffZ=originZ-az;


let px=diffY*caz-diffZ*cay;
let py=diffZ*cax-diffX*caz;
let pz=diffX*cay-diffY*cax;


let u1=sign*(directionX*px+directionY*py+directionZ*pz);


if(u1<0){ continue; }


px=bay*diffZ-baz*diffY;
py=baz*diffX-bax*diffZ;
pz=bax*diffY-bay*diffX;


let u2=sign*(directionX*px+directionY*py+directionZ*pz);


if(u2<0){ continue; }


if(u1+u2>DdN){ continue; }


let u3=-sign*(diffX*normalX+diffY*normalY+diffZ*normalZ);


if(u3<0){ continue; }


let d=u3/DdN;


if(d>distance){ continue; }


distance=d;
result=d;


}
}


return result;


}


export{intersection_ray_triangle};
