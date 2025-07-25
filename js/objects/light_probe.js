async function light_probe_update(){
	
	
let light_probe_rtt=new THREE.WebGLCubeRenderTarget(256,{colorSpace:THREE.SRGBColorSpace});


let light_probe_cube_camera=new THREE.CubeCamera(0.1,2000,light_probe_rtt);
let light_probe=new THREE.LightProbe();
	
	
light_probe_cube_camera.position.copy(camera_position);
light_probe_cube_camera.update(renderer,scene);
let value=await LightProbeGenerator.fromCubeRenderTarget(renderer,light_probe_rtt);
//let value=await LightProbeGenerator.fromCubeTexture(environment_main);
light_probe.copy(value);
light_probe.intensity=2;
light_probe.position.copy(camera_position);
scene.add(light_probe);
helper["light_probe"]=new LightProbeHelper(light_probe,0.2);
helper["light_probe"].position.copy(camera_position);
scene.add(helper["light_probe"]);


}