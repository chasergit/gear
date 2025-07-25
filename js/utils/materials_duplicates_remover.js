// 130619 ДАТА СОЗДАНИЯ
// 250821 ОПТИМИЗАЦИЯ


// УБИРАЕТ ОДИНАКОВЫЕ МАТЕРИАЛЫ, УМЕНЬШАЯ КОЛИЧЕСТВО ВЫЗОВОВ ОТРИСОВКИ (DRAW CALLS).
// ПРИМЕНЯЕТСЯ ТОЛЬКО ДЛЯ BufferGeometry


function materials_duplicates_remover(object){


// ЕСЛИ НЕТ НЕСКОЛЬКИХ ТЕКСТУР, ТО ВЫХОДИМ


if(object.material.length==undefined){ return; }


let mat_name=[]; // НАЧАЛЬНЫЙ СПИСОК ИМЁН МАТЕРИАЛОВ uuid И ИХ ПОРЯДКОВЫЕ НОМЕРА
let mat_new=[]; // УНИКАЛЬНЫЕ МАТЕРИАЛЫ
let mat_same_found=0; // НАЙДЕНЫ ЛИ ПОВТОРЯЮЩИЕСЯ МАТЕРИАЛЫ


let max=object.material.length;
for(let n=0;n<max;n++){
let material=object.material[n];
let uuid=material.uuid;
if(mat_name[uuid]==undefined){
mat_name[uuid]=[];
mat_new.push(material);
}
else{
mat_same_found=1; // ПОВТОРЯЮЩИЙСЯ МАТЕРИАЛ НАЙДЕН
}
mat_name[uuid].push(n);
}


// ЕСЛИ НЕТ ПОВТОРЯЮЩИХСЯ МАТЕРИАЛОВ, ТО ВЫХОДИМ
if(!mat_same_found){ return; }


object.material=mat_new; // УСТАНАВЛИВАЕМ СРАЗУ УНИКАЛЬНЫЕ МАТЕРИАЛЫ


let attributes=[]; // АТРИБУТЫ


for(let i in object.geometry.attributes){
attributes[i]=[];
}


let groups=[]; // ГРУППЫ, ОБОЗНАЧАЮЩИЕ К КАКИМ ТРЕУГОЛЬНИКАМ КАКИЕ МАТЕРИАЛЫ ПРИМЕНИТЬ
let num=0; // НОМЕР СОЗДАННОЙ ГРУППЫ
let start=0; // КАКОЙ НАЧАЛЬНЫЙ НОМЕР ТРЕУГОЛЬНИКА ДЛЯ ПРИМЕНЕНИЯ МАТЕРИАЛА


// ПРОХОДИМСЯ ПО СПИСКУ ИМЁН МАТЕРИАЛОВ uuid
for(let i in mat_name){


// ОБОЗНАЧАЕМ НАЧАЛЬНЫЙ НОМЕР ТРЕУГОЛЬНИКА ДЛЯ ВЫБОРКИ И СКОЛЬКО ТРЕУГОЛЬНИКОВ ВЫБРАТЬ. ПО УМОЛЧАНИЮ 0
groups[num]=[start,0];


let item_mat=mat_name[i];
let max_mat=item_mat.length;


// ПРОХОДИМЯ ПО ПОРЯДКОВЫМ НОМЕРАМ МАТЕРИАЛОВ. ОНИ СООТВЕТСТВУЮТ НОМЕРАМ В geometry.groups
for(let n=0;n<max_mat;n++){


let group=object.geometry.groups[item_mat[n]];


// ПЕРЕНОСИМ НУЖНЫЕ АТРИБУТЫ ТРЕУГОЛЬНИКОВ НАЧИНАЯ С НОМЕРА start И ЗАКАНЧИВАЯ НОМЕРОМ end
let att=object.geometry.attributes;
for(let b in att){
let end=group.start+group.count;
for(let h=group.start;h<end;h++){
let item_att=att[b];
let max_att_size=item_att.itemSize;
for(let m=0;m<max_att_size;m++){
attributes[b].push(item_att.array[h*max_att_size+m]);
}
}
}


start+=group.count; // УВЕЛИЧИВАЕМ НАЧАЛЬНЫЙ НОМЕР ТРЕУГОЛЬНИКА, С КОТОРОГО НАЧИНАТЬ СЛЕДУЮЩУЮ ВЫБОРКУ
groups[num][1]+=group.count; // ЗАПИСЫВАЕМ СКОЛЬКО ТРЕУГОЛЬНИКОВ ВЫБРАЛИ
}


num++;


}


object.geometry.groups=[]; // ОПУСТОШАЕМ СТАРУЮ ГРУППУ


// СТАВИМ ОТСОРТИРОВАННУЮ ГРУППУ


max=groups.length;
for(let n=0;n<max;n++){
object.geometry.groups[n]={start:groups[n][0],count:groups[n][1],materialIndex:n};
}


// СТАВИМ ОТСОРТИРОВАННЫЕ АТРИБУТЫ


for(let i in attributes){
object.geometry.attributes[i].array=new Float32Array(attributes[i]);
}


}


export{materials_duplicates_remover};
