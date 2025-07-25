function overlay_damage_blood(){


mat["overlay_damage_blood"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["overlay_damage_blood"]},
intensity:{value:1.0}
},
vertexShader:vs["overlay_damage_blood"],
fragmentShader:fs["overlay_damage_blood"],
transparent:true,
depthTest:false,
depthWrite:false,
//blending:THREE.AdditiveBlending,
});


mesh["overlay_damage_blood"]=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mat["overlay_damage_blood"]);
modules_to_resize.push(()=>{
mesh["overlay_damage_blood"].matrixWorld.elements[0]=screen_width;
mesh["overlay_damage_blood"].matrixWorld.elements[5]=screen_height;
});


mesh["overlay_damage_blood"].frustumCulled=false;
mesh["overlay_damage_blood"].matrixAutoUpdate=false;
mesh["overlay_damage_blood"].updateMatrixWorld=function(){};
//scene_hud.add(mesh["overlay_damage_blood"]);


}