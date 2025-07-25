function fullscreen_pointerlock(){
	
	
if(!document.fullscreenElement){ document.documentElement.requestFullscreen(); }


}


function event_listeners_set(){


document.addEventListener("keydown",(event)=>{ key_status[event.code]=true; });
document.addEventListener("keyup",(event)=>{ key_status[event.code]=false; key_up[event.code]=true; });


document.addEventListener("mousedown",(event)=>{
if(event.button==0){ click_left_down=true; }
if(event.button==2){ click_right_down=true; }
});


document.addEventListener("mouseup",(event)=>{
if(event.button==0){ click_left_up=true; }
if(event.button==2){ click_right_up=true; }
});


// ____________________ ЗАКРЕПЛЕНИЕ КУРСОРА МЫШКИ ____________________


document.addEventListener("fullscreenchange",()=>{
if(document.fullscreenElement && document.body.requestPointerLock){ document.body.requestPointerLock(); } 
});


// ____________________ УПРАВЛЕНИЕ МЫШКОЙ ____________________


document.addEventListener("mousemove",(event)=>{
if(document.pointerLockElement===document.body){ player_rotate(event); }
});


}