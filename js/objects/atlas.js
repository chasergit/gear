// УСТАНАВЛИВАЕМ НОМЕР ТЕКСТУРЫ


function atlas_set(){


for(let i in atlas){
let number=0;
let match=atlas[i][1].match(/^[^\-]*-(\d{1,2})/);
if(match){ number=Number(match[1]); }
atlas[i][1]=number;
}

	
}