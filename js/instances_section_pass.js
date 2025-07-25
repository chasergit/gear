let section_100_x=-1;
let section_100_z=0;
let p_section_100_x=0;
let p_section_100_z=0;


let section_100_objects=[];
let ways_9=[[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]];
let ways_25=[
[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],
[-2,-1],[-1,-1],[0,-1],[1,-1],[2,-1],
[-2,0],[-1,0],[0,0],[1,0],[2,0],
[-2,1],[-1,1],[0,1],[1,1],[2,1],
[-2,2],[-1,2],[0,2],[1,2],[2,2],
];


function instances_section_pass_check(){
	
	
p_section_100_x=Math.floor(player.position.x/100);
p_section_100_z=Math.floor(player.position.z/100);


if(p_section_100_x!=section_100_x || p_section_100_z!=section_100_z){ instances_section_pass_update(); }


}	
	
	
function instances_section_pass_update(){


let started_1=performance.now();
let started_2=performance.now();


/*
for(let i=0;i<25;i++){
let cell_name=(section_100_x+ways_25[i][0])+"_"+(section_100_z+ways_25[i][1]);
if(section_100_objects[cell_name]!=undefined){
let max_section_100_objects=section_100_objects[cell_name].length;
for(let n=0;n<max_section_100_objects;n++){
scene.remove(mesh[section_100_objects[cell_name][n]]);
}
}
}
*/


let count=0;


for(let i=0;i<25;i++){


let cell_name=(p_section_100_x+ways_25[i][0])+"_"+(p_section_100_z+ways_25[i][1]);


if(section_100_objects[cell_name]==undefined){ continue; }


let max_objects=section_100_objects[cell_name].length;


for(let n=0;n<max_objects;n++){


let item=mesh[section_100_objects[cell_name][n]].geometry.attributes;


// ЗДЕСЬ МОГУТ БЫТЬ И ОГРАНИЧИВАЮЩИЕ СФЕРЫ. ОТСЕИВАЕМ ИХ
if(item.scale==undefined){ continue; }
count+=item.scale.array.length;


}


}


let scale=new Float32Array(count);
let offset=new Float32Array(count*3);
let orientation=new Float32Array(count*4);
let color=new Float32Array(count*3);


let one_c=0;
let three_c=0;
let four_c=0;


for(let i=0;i<25;i++){


let cell_name=(p_section_100_x+ways_25[i][0])+"_"+(p_section_100_z+ways_25[i][1]);


if(section_100_objects[cell_name]==undefined){ continue; }


let max_objects=section_100_objects[cell_name].length;


for(let n=0;n<max_objects;n++){


let item=mesh[section_100_objects[cell_name][n]].geometry.attributes;


// ЗДЕСЬ МОГУТ БЫТЬ И ОГРАНИЧИВАЮЩИЕ СФЕРЫ. ОТСЕИВАЕМ ИХ
if(item.scale==undefined){ continue; }


let i_scale=item.scale.array;
let i_offset=item.offset.array;
let i_color=item.color.array;
let i_orientation=item.orientation.array;


let max_one_elements=i_scale.length;


for(let j=0;j<max_one_elements;j++){


// ОДНО ЗНАЧЕНИЕ
scale[j+one_c]=i_scale[j];


// ТРИ ЗНАЧЕНИЯ
let i0=j*3;
let p=i0+three_c;
let p_one=p+1;
let p_two=p+2;
let i1=i0+1;
let i2=i0+2;
offset[p]=i_offset[i0];
offset[p_one]=i_offset[i1];
offset[p_two]=i_offset[i2];
color[p]=i_color[i0];
color[p_one]=i_color[i1];
color[p_two]=i_color[i2];


// ЧЕТЫРЕ ЗНАЧЕНИЯ
i0=j*4;
p=i0+four_c;
orientation[p]=i_orientation[i0];
orientation[p+1]=i_orientation[i0+1];
orientation[p+2]=i_orientation[i0+2];
orientation[p+3]=i_orientation[i0+3];
}


one_c+=max_one_elements;
three_c=one_c*3;
four_c=one_c*4;


//scene.add(mesh[section_100_objects[cell_name][n]]);
//mesh["instance_grass_long"].geometry.attributes.offset.
}
}


started_2=(performance.now()-started_2).toFixed(3);


let started_3=performance.now();


// УСТАНАВЛИВАЕМ ДИНАМИЧНОСТЬ, ЧТОБЫ НЕ БЫЛО СКАЧКОВ FPS ПРИ УДАЛЕНИИ МУСОРА В ОЗУ


let item=mesh["instance_grass_long"].geometry.attributes;
item.scale=new THREE.InstancedBufferAttribute(scale,1).setUsage(THREE.DynamicDrawUsage);
item.offset=new THREE.InstancedBufferAttribute(offset,3).setUsage(THREE.DynamicDrawUsage);
item.orientation=new THREE.InstancedBufferAttribute(orientation,4).setUsage(THREE.DynamicDrawUsage);
item.color=new THREE.InstancedBufferAttribute(color,3).setUsage(THREE.DynamicDrawUsage);


// ТАК КАК ДИНАМИЧЕСКИЙ ВАРИАНТ, ТО НЕОБХОДИМО УКАЗЫВАТЬ КОЛИЧЕСТВО


mesh["instance_grass_long"].geometry._maxInstanceCount=count;


section_100_x=p_section_100_x;
section_100_z=p_section_100_z;


debug_text.push(["section_100","<font></font>"+section_100_x+" "+section_100_z]);
debug_text.push(["section_pass","<font></font>"+(performance.now()-started_1).toFixed(3)+" FIRST: "+started_2+" SECOND: "+(performance.now()-started_3).toFixed(3)+" GRASS: "+count]);


}
