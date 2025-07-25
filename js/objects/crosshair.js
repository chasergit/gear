function crosshair_set(){


mat["crosshair"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["crosshair"]},
scale:{value:1}
},
vertexShader:vs["crosshair"],
fragmentShader:fs["crosshair"],
transparent:true,
depthTest:false,
depthWrite:false,
});


mesh["crosshair"]=new THREE.Mesh(new THREE.PlaneGeometry(1,1),mat["crosshair"]);
mesh["crosshair"].frustumCulled=false;
mesh["crosshair"].matrixAutoUpdate=false;
mesh["crosshair"].updateMatrixWorld=function(){};
scene_hud.add(mesh["crosshair"]);


}