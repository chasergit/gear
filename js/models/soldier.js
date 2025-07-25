mat["soldier_body"]=new THREE.MeshStandardMaterial({
map:tex["soldier_body_d"],
normalMap:tex["soldier_body_n"],
normalScale:{x:1,y:1},
//roughnessMap:tex["soldier_body_s"],
//roughness:1,
});


mat["soldier_head"]=new THREE.MeshStandardMaterial({
map:tex["soldier_head_d"],
normalMap:tex["soldier_head_n"],
normalScale:{x:1,y:1},
//roughnessMap:tex["soldier_head_s"],
//roughness:2.2,
});


FBXLoader.load('./models/soldier/soldier.fbx',function(object){


mesh["soldier"]=object;
// НАЗНАЧАЕМ МАТЕРИАЛ ОТДЕЛЬНО, ЧТОБЫ ПОТОМ МОЖНО БЫЛО ЕГО МЕНЯТЬ СРАЗУ НА ВСЕХ ОБЪЕКТАХ
// КОЛИЧЕСТВО ТЕКСТУР УВЕЛИЧИВАЕТСЯ В СТАТИСТИКЕ РЕНДЕРИНГА, НО НА ПАМЯТИ ЭТО НИКАК НЕ ОТРАЖАЕТСЯ,
// Т.К. В ПАМЯТИ ХРАНИТСЯ ВСЕГО ОДНА ТЕКСТУРА, А ОСТАЛЬНОЕ ЭТО ССЫЛКИ НА НЕЁ
// ЕСЛИ НУЖЕН РАЗНЫЙ МАТЕРИАЛ, ТО ДЛЯ КАЖДОГО НАДО СОЗДАВАТЬ НОВЫЙ МАТЕРИАЛ С НУЖНЫМИ СВАОЙСТВАМИ
// ЕСЛИ В НОВОМ МАТЕРИАЛЕ БУДЕТ ТАЖЕ ТЕКСТУРА, ТО ТОЖЕ НЕ ЗАЙМЁТ ПАМЯТЬ, А ТОЛЬКО УВЕЛИЧИТСЯ КОЛИЧЕСТВО ТЕКСТУР В СТАТИСТИКЕ РЕНДЕРИНГА
mesh["soldier"].children[2].material=mat["soldier_body"];
mesh["soldier"].children[3].material[0]=mat["soldier_body"];
mesh["soldier"].children[3].material[1]=mat["soldier_head"];


// СКРЫВАЕМ КОСТИ, СНИЖАЯ НАГРУЗКУ НА 10%. ПРИ ЭТОМ ДОСТАТОЧНО СКРЫТЬ ПЕРВУЮ ОСНОВНУЮ КОСТЬ, ОСТАЛЬНЫЕ НЕОБЯЗАТЕЛЬНО.
mesh["soldier"].traverse(function(child){
if(child.isBone){ child.visible=false; }
});


mesh["soldier"].traverse(function(child){
if(child.isMesh){
child.castShadow=true;
child.receiveShadow=true;
}
});


});
