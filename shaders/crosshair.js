vs["crosshair"]=`


uniform float scale;
varying vec2 vUv;


void main(){


vUv=(uv*2.0-1.0);


// БЕЗ modelViewMatrix
gl_Position=projectionMatrix*vec4(position*scale,1.0);


}


`;


fs["crosshair"]=`


uniform sampler2D map;
uniform float scale;
varying vec2 vUv;


void main(){


float radius=0.5;
float thickness=1.0/scale*10.0;
float circle=smoothstep(thickness,0.0,abs(length(vUv)-radius));
gl_FragColor=vec4(vec3(circle),pow(circle,10.0));


}


`;
