let sprite=[];


sprite["flare"]=[];
sprite["wall"]=[];
sprite["shine"]=[];
sprite["beam"]=[];


sprite["wolf"]=[];
sprite["soul"]=[];
sprite["other"]=[];


function sprites_set(){


sprite["flare"].push({offset:[-0.8,0.2,-8],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["flare"].push({offset:[-0.8,0.2,-9],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["flare"].push({offset:[-0.8,0.2,-10],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[0,1,1,1],blend:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["flare"].push({offset:[-0.8,0.2,-11],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[0,1,1,1],blend:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["flare"].push({offset:[-0.8,0.2,-12],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,0.4,0,1],blend:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["flare"].push({offset:[-0.8,0.2,-13],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,0.4,0,1],blend:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});


sprite["flare"].push({offset:[-0.7,2.6,-19.6],scale:[1.0,1.0],quaternion:[0,0,0,2],rotation:0,color:[1,0.7,0,1],blend:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});


sprite["flare"].push({offset:[-6.0,0.3,-16.9],scale:[0.5,0.5],quaternion:[0,0,0,2],rotation:0,color:[0,1,1,1],blend:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["flare"].push({offset:[-8.3,0.3,-16.9],scale:[0.5,0.5],quaternion:[0,0,0,2],rotation:0,color:[0,1,1,1],blend:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["flare"].push({offset:[-10.8,0.3,-16.9],scale:[0.5,0.5],quaternion:[0,0,0,2],rotation:0,color:[0,1,1,1],blend:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});


for(let n=0;n<1000;n++){
let x=(Math.random()*2-1)*3;
let z=(Math.random()*2-1)*3;
sprite["flare"].push({offset:[-4.7+x,1.0,6.9+z],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
}


sprite["wall"].push({offset:[2.0,1.5,-14.3],scale:[0.5,0.5],quaternion:[0,0,0,2],rotation:0,color:[0,1,1,1],blend:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});


sprite["shine"].push({offset:[3.0,1.5,-14.3],scale:[0.5,0.5],quaternion:[0,0,0,2],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["flare_blue"][0],texture:atlas["flare_blue"][1]});


for(let n=0;n<8;n++){
sprite["beam"].push({offset:[-1.4-n*1.6,0.2,-19.75],scale:[0.2,1.4],quaternion:[1,0,0,6],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["light_10"][0],texture:atlas["light_10"][1]});
}


sprite["wolf"]["eye_1"]={offset:[0,0,0],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,0.4,1,5],blend:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]};
sprite["wolf"]["eye_2"]={offset:[0,0,0],scale:[0.2,0.2],quaternion:[0,0,0,2],rotation:0,color:[1,0.4,1,5],blend:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]};
sprite["wolf"]["tail"]={offset:[0,0,0],scale:[1,1],quaternion:[0,0,0,2],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]};


sprite["soul"]["soul_1_1"]={origin:[13,1.2,4],offset:[13,1,4],scale:[1,1],quaternion:[0,0,0,2],rotation:-0.002,color:[1,1,1,1],blend:0,frame:atlas["flare_blue"][0],texture:atlas["flare_blue"][1]};
sprite["soul"]["soul_1_2"]={origin:[13,1.2,4],offset:[13,1,4],scale:[1,1],quaternion:[0,0,0,2],rotation:0.002,color:[1,1,1,1],blend:0,frame:atlas["flare_blue"][0],texture:atlas["flare_blue"][1]};
sprite["soul"]["soul_2_1"]={origin:[30,1,0],offset:[13,1,4],scale:[5,5],quaternion:[0,0,0,2],rotation:-0.002,color:[1,1,1,1],blend:0,frame:atlas["flare_blue"][0],texture:atlas["flare_blue"][1]};
sprite["soul"]["soul_2_2"]={origin:[30,1,0],offset:[13,1,4],scale:[5,5],quaternion:[0,0,0,2],rotation:0.002,color:[1,1,1,1],blend:0,frame:atlas["flare_blue"][0],texture:atlas["flare_blue"][1]};


sprite["other"].push({offset:[9,1.5,1],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[0,0,0,1],blend:1,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[9.5,1.5,1],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[0,0,0,1],blend:1,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[9.5,1.5,0.5],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[1,0.8,0,1],blend:1,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[10.0,1.5,1],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[0,0,0,1],blend:1,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[9.5,1.5,1.5],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[1,0,0,1],blend:1,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});


sprite["other"].push({offset:[9.5,1,-2],scale:[5,1],quaternion:[0,0.7,0,0.7],rotation:0.001,color:[1,1,1,1],blend:1.1,frame:atlas["fire"][0],texture:atlas["fire"][1]});


sprite["other"].push({offset:[7,1,10],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[1,1,1,1],blend:1,frame:atlas["glass_1"][0],texture:atlas["glass_1"][1]});


sprite["other"].push({offset:[7,1,6],scale:[4,4],quaternion:[0,0,0,3],rotation:0.001,color:[1,1,1,1],blend:1,frame:atlas["smoke"][0],texture:atlas["smoke"][1]});
sprite["other"].push({offset:[6,1,4],scale:[4,4],quaternion:[0,0,0,3],rotation:0.001,color:[1,1,1,1],blend:1,frame:atlas["smoke"][0],texture:atlas["smoke"][1]});
sprite["other"].push({offset:[7,1,4],scale:[4,4],quaternion:[0,0,0,3],rotation:0.001,color:[1,1,1,1],blend:1,frame:atlas["smoke"][0],texture:atlas["smoke"][1]});


sprite["other"].push({offset:[9.5,1,4.5],scale:[1,1],quaternion:[0,0,0,3],rotation:-0.002,color:[1,1,1,1],blend:1,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});


sprite["other"].push({offset:[7,1,2],scale:[1,1],quaternion:[0,0,0,3],rotation:0.002,color:[1,1,0,1],blend:1,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[7,1,2.5],scale:[1,1],quaternion:[0,0,0,3],rotation:0.001,color:[1,0,1,1],blend:1,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[7,1,3],scale:[1,1],quaternion:[0,0,0,3],rotation:0.003,color:[0,1,1,1],blend:1,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});


sprite["other"].push({offset:[-300,200,0],scale:[100,100],quaternion:[0,0,0,4],rotation:0,color:[1,1,1,1],blend:1,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});


sprite["other"].push({offset:[-1.05,1.25,-8.5],scale:[0.2,1.0],quaternion:[0,0,0,4],rotation:0,color:[0,0.9,0.81,1],blend:0,frame:atlas["beam"][0],texture:atlas["beam"][1]});
sprite["other"].push({offset:[-1.05,1.25,-10.0],scale:[0.2,1.0],quaternion:[0,0,0,4],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[-4.35,1.1,1.7],scale:[1,1],quaternion:[0,0,1,7],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["other"].push({offset:[-5.6,1.1,1.7],scale:[1,1],quaternion:[0,0,1,7],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["sprite_yellow"][0],texture:atlas["sprite_yellow"][1]});
sprite["other"].push({offset:[21,1.25,-4.5],scale:[0.4,4.],quaternion:[1,0,0,6],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[20,1.25,1.5],scale:[0.4,10.],quaternion:[0,0,1,6],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[20,1.0,1.5],scale:[0.4,10.],quaternion:[0,0,1,6],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[21,1.0,-3],scale:[0.4,0.4],quaternion:[0,0,1,3],rotation:0,color:[2.0,1,1,1],blend:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[26,1.0,1.5],scale:[0.4,10.],quaternion:[0,1,0,6],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[20,3.0,1.5],scale:[0.4,10.],quaternion:[0,0,1,6],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["spark"][0],texture:atlas["spark"][1]});
sprite["other"].push({offset:[14.22,1.0,55.6],scale:[2.0,4.0],quaternion:[15.0,1.0,55.3,5],rotation:0,color:[1,1,1,1],blend:1,frame:atlas["water_drop"][0],texture:atlas["water_drop"][1]});
sprite["other"].push({offset:[21,1.0,1.5],scale:[0.1,10.],quaternion:[0,0,1,6],rotation:0,color:[1,1,1,0.5],blend:1,frame:atlas["smoke"][0],texture:atlas["smoke"][1]});
sprite["other"].push({offset:[24,1.25,-2.6],scale:[1.0,0.5],quaternion:[0,1,1,5],rotation:0.001,color:[1,1,1,1],blend:1,frame:atlas["cloud"][0],texture:atlas["cloud"][1]});
sprite["other"].push({offset:[-1.05,1.25,-13.0],scale:[0.2,1.0],quaternion:[0,0,0,4],rotation:0,color:[0,0.9,0.81,1],blend:0,frame:atlas["beam"][0],texture:atlas["beam"][1]});

sprite["other"].push({offset:[18,1.25,6],scale:[0.4,10.],quaternion:[0,0,1,6],rotation:0,color:[1,1,1,1],blend:0,frame:atlas["tracer"][0],texture:atlas["tracer"][1]});


sprite["other"].push({offset:[-1.05,1.3,-10.75],scale:[1.2,0.8],quaternion:[0,0.7,0,0.7],rotation:0,color:[1,1,1,1],blend:0.8,frame:atlas["glass_1"][0],texture:atlas["glass_1"][1]});


sprite["other"].push({offset:[-0.1,1.7,13],scale:[2,1.4],quaternion:[0,0.7,0,0.7],rotation:0,color:[1,1,1,0.4],blend:0,frame:atlas["window"][0],texture:atlas["window"][1]});
sprite["other"].push({offset:[14.0,1.7,-5.1],scale:[2,1.4],quaternion:[0,0,0,1],rotation:0,color:[1,1,1,0.4],blend:0,frame:atlas["window"][0],texture:atlas["window"][1]});


sprite["other"].push({offset:[16,1.0,0],scale:[1.0,1.0],quaternion:[0,0,0,2],rotation:0,color:[1,1,1,1],blend:1,frame:atlas["homer"][0],texture:atlas["homer"][1]});
sprite["other"].push({offset:[16,1.5,0],scale:[1.0,0.25],quaternion:[0,0,0,2],rotation:0,color:[1,1,1,1],blend:1,frame:atlas["avatar"][0],texture:atlas["avatar"][1]});


sprite["other"].push({offset:[18,1.0,0],scale:[1.0,1.0],quaternion:[0,0,0,2],rotation:0.001,color:[1,1,1,1],blend:0,frame:atlas["shot"][0],texture:atlas["shot"][1]});


sprite["other"].push({offset:[35,0.0,72],scale:[2,2],quaternion:[0,0,0,3],rotation:0.001,color:[1,1,1,1],blend:1,frame:atlas["water_splash"][0],texture:atlas["water_splash"][1]});
sprite["other"].push({offset:[35,0.0,72],scale:[1.8,1.8],quaternion:[0,0,0,3],rotation:-0.001,color:[1,1,1,1],blend:1,frame:atlas["water_splash"][0],texture:atlas["water_splash"][1]});


}


function sprites_soul_f(){
	
	
let y=sprite["soul"]["soul_1_1"].origin[1]+Math.sin(time/1000)/6;
sprite["soul"]["soul_1_1"].offset[1]=y;
sprite["soul"]["soul_1_2"].offset[1]=y;
let p=sprite["soul"]["soul_2_1"].origin;
let x=p[0]+Math.sin(time/2000)*2;
y=p[1]+Math.sin(time/500)*1;
let z=p[2]+Math.cos(time/2000)*2;
sprite["soul"]["soul_2_1"].offset=[x,y,z];
sprite["soul"]["soul_2_2"].offset=[x,y,z];


}


function sprites_calculations(){
	
	
// ВОДОПАД
sprite["other"][25].frame[3]=-time/500;


sprites_soul_f();


if(wolf_tail_bone){


let item_1=mesh["eye_1"].matrixWorld.elements;
let item_2=sprite["wolf"]["eye_1"].offset;
item_2[0]=item_1[12];
item_2[1]=item_1[13];
item_2[2]=item_1[14];


item_1=mesh["eye_2"].matrixWorld.elements;
item_2=sprite["wolf"]["eye_2"].offset;
item_2[0]=item_1[12];
item_2[1]=item_1[13];
item_2[2]=item_1[14];


for(let n=0;n<1;n++){
wolf_tail[0][0].multiplyMatrices(wolf_tail[0][1],wolf_tail[0][2]);
let item_1=wolf_tail[0][3];
let item_2=sprite["wolf"]["tail"].offset;
item_2[0]=item_1[12];
item_2[1]=item_1[13];
item_2[2]=item_1[14];
}


}


}