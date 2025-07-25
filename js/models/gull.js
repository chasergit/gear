// ____________________ GULL ____________________


mat["gull"]=new THREE.MeshStandardMaterial({
map:tex["gull_d"],
});


FBXLoader.load('./models/gull/gull.fbx',function(object){


mesh["gull"]=object;
// НАЗНАЧАЕМ МАТЕРИАЛ ОТДЕЛЬНО, ЧТОБЫ ПОТОМ МОЖНО БЫЛО ЕГО МЕНЯТЬ СРАЗУ НА ВСЕХ ОБЪЕКТАХ
// КОЛИЧЕСТВО ТЕКСТУР УВЕЛИЧИВАЕТСЯ В СТАТИСТИКЕ РЕНДЕРИНГА, НО НА ПАМЯТИ ЭТО НИКАК НЕ ОТРАЖАЕТСЯ,
// Т.К. В ПАМЯТИ ХРАНИТСЯ ВСЕГО ОДНА ТЕКСТУРА, А ОСТАЛЬНОЕ ЭТО ССЫЛКИ НА НЕЁ
// ЕСЛИ НУЖЕН РАЗНЫЙ МАТЕРИАЛ, ТО ДЛЯ КАЖДОГО НАДО СОЗДАВАТЬ НОВЫЙ МАТЕРИАЛ С НУЖНЫМИ СВАОЙСТВАМИ
// ЕСЛИ В НОВОМ МАТЕРИАЛЕ БУДЕТ ТАЖЕ ТЕКСТУРА, ТО ТОЖЕ НЕ ЗАЙМЁТ ПАМЯТЬ, А ТОЛЬКО УВЕЛИЧИТСЯ КОЛИЧЕСТВО ТЕКСТУР В СТАТИСТИКЕ РЕНДЕРИНГА
mesh["gull"].children[1].material=mat["gull"];


// СКРЫВАЕМ КОСТИ, СНИЖАЯ НАГРУЗКУ НА 10%. ПРИ ЭТОМ ДОСТАТОЧНО СКРЫТЬ ПЕРВУЮ ОСНОВНУЮ КОСТЬ, ОСТАЛЬНЫЕ НЕОБЯЗАТЕЛЬНО.
mesh["gull"].traverse(function(child){
if(child.isBone){ child.visible=false; }
});


mesh["gull"].traverse(function(child){
if(child.isMesh){
child.castShadow=true;
child.receiveShadow=true;
}
});


mesh["gull_fly_1"]=SkeletonUtils.clone(mesh["gull"]);
mesh["gull_fly_1"].animations=mesh["gull"].animations;
mixer["gull_fly_1"]=new THREE.AnimationMixer(mesh["gull_fly_1"]);
action["gull_fly_1"]=THREE.AnimationUtils.subclip(mesh["gull_fly_1"].animations[0],'attack',0,13);
action["gull_fly_1"]=mixer["gull_fly_1"].clipAction(action["gull_fly_1"]);
action["gull_fly_1"].play();
mixers.push(mixer["gull_fly_1"]);
mesh["gull_fly_1"].animations=[];
mesh["gull_fly_1"].scale.set(0.04,0.04,0.04);
mesh["gull_fly_1"].position.set(40,20,130);
mesh["gull_fly_1"].rotation.y=0;
mesh["gull_fly_1"].children[1].frustumCulled=false;
mesh["gull_fly_1"].children[1].onAfterRender=function(){
this.frustumCulled=true;
this.onAfterRender=function(){};
}
scene.add(mesh["gull_fly_1"]);


mesh["gull_fly_2"]=SkeletonUtils.clone(mesh["gull"]);
mesh["gull_fly_2"].animations=mesh["gull"].animations;
mixer["gull_fly_2"]=new THREE.AnimationMixer(mesh["gull_fly_2"]);
action["gull_fly_2"]=THREE.AnimationUtils.subclip(mesh["gull_fly_2"].animations[0],'attack',0,13);
action["gull_fly_2"]=mixer["gull_fly_2"].clipAction(action["gull_fly_2"]);
action["gull_fly_2"].play();
mixers.push(mixer["gull_fly_2"]);
mesh["gull_fly_2"].animations=[];
mesh["gull_fly_2"].scale.set(0.04,0.04,0.04);
mesh["gull_fly_2"].position.set(2,0,-8);
mesh["gull_fly_2"].rotation.y=0;
mesh["gull_fly_2"].children[1].frustumCulled=false;
mesh["gull_fly_2"].children[1].onAfterRender=function(){
this.frustumCulled=true;
this.onAfterRender=function(){};
}
scene.add(mesh["gull_fly_2"]);


});
