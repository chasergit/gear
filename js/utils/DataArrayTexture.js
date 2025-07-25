function DataArrayTexture_set(items){
	

let width=0;
let height=0;
let depth=items.length;


for(let n=0;n<depth;n++){
if(width<items[n].image.width){ width=items[n].image.width; }
if(height<items[n].image.height){ height=items[n].image.height; }
}


let size=width*height;
let size_4=size*4;
let data=new Uint8Array(4*size*depth);


let canvas=document.createElement("canvas");
let ctx=canvas.getContext("2d",{willReadFrequently:true});
canvas.width=width;
canvas.height=height;


for(let n=0;n<depth;n++){
let texture_height=items[n].image.height;
ctx.save();
ctx.scale(1,-1);
ctx.translate(0,-texture_height);
ctx.drawImage(items[n].source.data,0,0);
let image_data=ctx.getImageData(0,0,width,height).data;
let offset=n*size_4;
for(let i=0;i<size_4;i++){
data[offset+i]=image_data[i];
}
ctx.restore();
ctx.clearRect(0,0,width,height);
}


let texture=new THREE.DataArrayTexture(data,width,height,depth);
texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
texture.colorSpace=THREE.SRGBColorSpace;
texture.generateMipmaps=true;
texture.minFilter=THREE.LinearMipmapLinearFilter;
texture.magFilter=THREE.LinearFilter;
texture.needsUpdate=true;
return texture; 


}