<?php


echo '<!DOCTYPE HTML>
<html>
<head>
<title>GEAR</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="shortcut icon" href="./textures/favicon.png" type="image/x-icon" />
<link href="./css/style.css" rel="stylesheet" type="text/css">
</head>


<body>


<div id="project" style="font-family:tahoma;height:100%;">


<div class="health_common" style="display:block;"><div class="health_pad"><div class="health_value"></div></div></div>
<div class="ammo_common"><div class="ammo_count">30</div><div class="ammo_title">Патроны</div></div>
<div class="grenade_common"><div class="grenade_count">4</div><div class="grenade_title">Гранаты</div></div>


<div id="loading" style="position:absolute;display:block;top:50%;width:100%;text-align:center;font-family:arial;font-size:40px;color:#ffffff;text-shadow:1px 1px 4px #393342;">ЗАГРУЖЕНО <span id="loading_amount" style="font-family:arial;font-size:40px;"></span></div>
<div id="begin" style="cursor:pointer;z-index:2;position:absolute;display:none;top:50%;width:100%;text-align:center;font-family:arial;font-size:40px;color:#ffffff;text-shadow:1px 1px 4px #393342;">СТАРТ</div>
<canvas id="canvas" style="display:block;"></canvas>
<canvas id="canvas_hud" style="display:block;position:absolute;top:0;left:0;"></canvas>
</div>


<script type="importmap">
{
"imports":{
"three": "./js/0_three/three_179.js",
"three/addons/": "./js/0_three/"
}
}
</script>


<script type="module">


"use strict"


import * as THREE from "three";
import Stats from "./js/stats/stats.js";
import GPUStatsPanel from "./js/stats/gpu_stats.js";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import * as THREE_BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import * as THREE_OBJLoader from "three/addons/loaders/OBJLoader.js"; // MODIFIED
import * as THREE_FBXLoader from "three/addons/loaders/FBXLoader.js"; // MODIFIED
import * as THREE_RGBELoader from "three/addons/loaders/RGBELoader.js";
import * as THREE_UltraHDRLoader from "three/addons/loaders/UltraHDRLoader.js";
import {LightProbeGenerator} from "three/addons/lights/LightProbeGenerator.js";
import {LightProbeHelper} from "three/addons/helpers/LightProbeHelper.js";
import {PositionalAudioHelper} from "three/addons/helpers/PositionalAudioHelper.js";


import { Octree } from "three/addons/math/Octree.js";
import { OctreeHelper } from "three/addons/helpers/OctreeHelper.js";
import { Capsule } from "three/addons/math/Capsule.js";


import {EffectComposer} from "three/addons/postprocessing/EffectComposer.js";
import {RenderPass} from "three/addons/postprocessing/RenderPass.js";
import {ShaderPass} from "three/addons/postprocessing/ShaderPass.js"; // MODIFIED
import {UnrealBloomPass} from "three/addons/postprocessing/UnrealBloomPass.js";
import {FXAAShader} from "three/addons/shaders/FXAAShader.js";


import underwater_shader from "./shaders/underwater_pass.js";
import underwater_ripples_shader from "./shaders/underwater_ripples_pass.js";
import correction_shader from "./shaders/correction_pass.js";
import {materials_duplicates_remover} from "./js/utils/materials_duplicates_remover.js";
import {lightMap} from "./js/utils/lightMap.js";
import {intersection_ray_AABB} from "./js/ray/intersection_ray_AABB.js";
import {intersection_ray_sphere} from "./js/ray/intersection_ray_sphere.js";
import {intersection_ray_triangle} from "./js/ray/intersection_ray_triangle.js";


';


$js_files=array(
'./js/stats/renderer_stats.js',
'./js/common.js',
'./js/utils/loader.js',
'./js/event_listeners.js',
'./js/init_core.js',
'./js/init_end.js',


'./js/textures_list.js',
'./js/models/models_list.js',
'./js/sounds_list.js',


'./js/objects/grass.js',


'./js/objects/shadow_ground_rtt.js',


'./js/utils/DataArrayTexture.js',
'./js/utils/debug.js',


'./js/objects/overlay_damage_blood.js',
'./js/objects/light_probe.js',
'./js/objects/weapon.js',
'./js/objects/crosshair.js',
'./js/objects/sprite.js',
'./js/objects/camera.js',
'./js/objects/player.js',
'./js/sprites_list.js',
'./js/sounds.js',
'./js/lights.js',


'./js/press_q.js',


'./shaders/water.js',
'./shaders/waterline.js',
'./shaders/water_refraction.js',
'./shaders/crosshair.js',
'./shaders/overlay_damage_blood.js',
'./shaders/sprite.js',
'./shaders/standard.js',
'./shaders/basic_lightmap.js',
'./shaders/grass.js',
'./shaders/tree_basic.js',
'./shaders/tree_sprite.js',
'./shaders/terrain_triplanar.js',



'./js/objects/water_core.js',
'./js/waters_list.js',


'./js/loop.js',


'./js/grass_place.js',
'./js/instances_section_pass.js',



'./js/objects/atlas.js',
'./textures/sprite/atlas/a-0.js',
'./textures/sprite/atlas/a-1.js',
'./textures/sprite/atlas/a-2.js',



'./js/models/landscape.js',
'./js/models/lightmap.js',
'./js/models/jetski.js',
'./js/models/soldier.js',
'./js/models/gun.js',
'./js/models/ammo.js',
'./js/models/uaz.js',
'./js/models/ship_cruise.js',
'./js/models/wolf.js',
'./js/models/gull.js',
'./js/models/grass_long.js',


);


foreach($js_files as $i){
echo file_get_contents($i);
}


echo '</script>
</body>
</html>';


?>
