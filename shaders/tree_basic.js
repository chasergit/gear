vs["i_tree_basic"]=`


attribute float scale;
attribute vec3 offset;
attribute vec4 orientation;
varying vec2 vUv;
uniform vec3 sun_direction;
varying float light;
void main(){
//if(distance(cameraPosition.xz,offset.xz)>50.0){ gl_Position=vec4(2.0,2.0,2.0,1.0); return; }
vec3 vPosition=position*scale;
vec3 vcV=cross(orientation.xyz,vPosition);
vPosition=vcV*(2.0*orientation.w)+(cross(orientation.xyz,vcV)*2.0+vPosition);
gl_Position=projectionMatrix*modelViewMatrix*vec4(vPosition+offset,1.0);
vUv=uv;
light=dot(normal,sun_direction)*1.5;

}


`;


fs["i_tree_basic"]=`


uniform sampler2D map;
varying vec2 vUv;
varying float light;
void main(){
gl_FragColor=vec4(texture2D(map,vUv).rgb*light,1.0);
}


`;
