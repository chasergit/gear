/*
ДАТА СОЗДАНИЯ: 080323-010525
ВАЖНО:
1. Когда текут 2 нормали с одинаковой текстурой и масштабом, то сливаются в одну текстуру. Менять либо масштаб, либо смещать по диагонали, либо разные текстуры.
2. Плохая текстура нормали может быть перевёрнутой, с полоской по краям или нет бесшовности.
*/


let water_stats=true; // ОТОБРАЖАТЬ СТАТИСТИКУ В КОНСОЛЕ
let water_debug=false; // ПОКАЗЫВАТЬ СЕТКУ ВОДЫ И ВОДНОЙ ЛИНИИ
let water=[];
let water_refaction_enabled=false;


// ____________________ НАСТРОЙКИ ВОДЫ ____________________


function waters_set(){


// ДОБАВЛЯЕМ ФУНКЦИЮ УДАЛЕНИЯ ОБЪЕКТА, КОТОРЫЙ БУДЕМ ИСПОЛЬЗОВАТЬ В from_mesh
mesh["lake"].delete=function(){ delete mesh["lake"]; };


water["lake"]={
from_mesh:mesh["lake"], // ПРЕВРАТИТЬ ОБЪЕКТ В ВОДУ, ИНАЧЕ null
width:0, // ШИРИНА 
depth:0, // ДЛИНА	
deep:12, // ГЛУБИНА
position:{x:0,y:0,z:0}, // ПОЗИЦИЯ
// [РАЗМЕР ЯЧЕЙКИ LOD МОЖЕТ БЫТЬ И 0 - ТОГДА БУДЕТ ПЛОСКОСТЬ ИЗ 2 ТРЕУГОЛЬНИКОВ, РАССТОЯНИЕ ДО ЦЕНТРА LOD]
// ДЛЯ ПЕРВОГО LOD РАССТОЯНИЕ ДО ЦЕНТРА МОЖНО НЕ УКАЗЫВАТЬ
// ДОПУСТИМЫЕ РАЗМЕРЫ ЯЧЕЙКИ: 0.125,0.25,0.5,1,2,4,8,16,32,64
// ПРИМЕР: cells_size:[[0.25,20]], БЕЗ LOD
// ПРИМЕР: cells_size:[[0.25,20],[0.25,100],[0,200]], 3 LOD 
// ЕСЛИ НУЖНА ПЛОСКАЯ ВОДА, ТО СТАВИМ: cells_size:[[0,0]], И use_waves:false
cells_size:[[0,0]],
// ВОЛНЫ ГЕРСТНЕРА
gerstner_waves:[new THREE.Vector4(-1.0,-1.0,0.05,60.0),new THREE.Vector4(-1.0,-0.6,0.05,31.0),new THREE.Vector4(-1.0,-1.3,0.05,18.0)],
gerstner_waves_speed:{value:0.001}, // СКОРОСТЬ ВОЛН
water_top_color:{value:new THREE.Color(0.0,0.96,0.48).convertSRGBToLinear()}, // ЦВЕТ ВОДЫ ВЕРХНИЙ		
water_bottom_color:{value:new THREE.Color(0.0,0.7,0.7).convertSRGBToLinear()}, // ЦВЕТ ВОДЫ НИЖНИЙ		
shore_transparent:{value:0.4}, // ПРОЗРАЧНОСТЬ БЕРЕГА 0-1
wave_color:{value:new THREE.Color(0.0,0.6,0.6).convertSRGBToLinear()}, // ЦВЕТ ВОЛНЫ
wave_color_power:{value:1.5}, // ФРИНЕЛЬ ЦВЕТА ВОЛНЫ
sss_color:{value:new THREE.Color(0.0,1.0,1.0)}, // ЦВЕТ ПОДПОВЕРХНОСТНОГО РАССЕИВАНИЯ СВЕТА
sss_value:{value:[0.66,5.0,10.0,0.01]}, // ПОДПОВЕРХНОСТНОЕ РАССЕИВАНИЕ СВЕТА [ИСКАЖЕНИЕ,ФРИНЕЛЬ,ИНТЕНСИВНОСТЬ,УМЕНЬШЕНИЕ ВЫСОТЫ СОЛНЦА ДЛЯ СОХРАНЕНИЯ ЭФФЕКТА]
shore_smoothing_intensity:{value:10.0}, // СГЛАЖИВАНИЕ БЕРЕГА 
refraction_value:{value:[0.05,10.0]}, // РЕФРАКЦИЯ [ИНТЕНСИНОВСТЬ,УМЕНЬШЕНИЕ РЕФРАКЦИИ У БЕРЕГА] 
// НОРМАЛЬ
normal_a_value:{value:[0.2,0,0.00015]}, // МЕЛКАЯ НОРМАЛЬ A [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_b_value:{value:[0.1,0,-0.00010]}, // МЕЛКАЯ НОРМАЛЬ B [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_ab:{value:1.0}, // ПЕРЕВОРОТ НОРМАЛИ ПО Y ЧЕРЕЗ -1. А ТАКЖЕ УМЕНЬШЕНИЕ ИНТЕНСИВНОСТЬ
normal_c_value:{value:[0.02,0,0.00010]}, // БОЛЬШАЯ НОРМАЛЬ C [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_d_value:{value:[0.01,0,-0.00005]}, // БОЛЬШАЯ НОРМАЛЬ D [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_cd:{value:1.0}, // ПЕРЕВОРОТ НОРМАЛИ ПО Y ЧЕРЕЗ -1. А ТАКЖЕ УМЕНЬШЕНИЕ ИНТЕНСИВНОСТЬ
normal_small_far_total:{value:[0.5,0.1]}, // НАСКОЛЬКО СМЕШАТЬ МАЛУЮ НОРМАЛЬ С БОЛЬШОЙ НОРМАЛЬЮ, И НА СКОЛЬКО СМЕШАТЬ ИХ С ВЕРШИННЫМИ ВОЛНАМ
// ОТРАЖЕНИЕ
env_mix:{value:1.0}, // НАСКОЛЬКО СИЛЬНО СМЕШИВАТЬ ОСНОВНУЮ НОРМАЛЬ С ТЕКСТУРНОЙ НОРМАЛЬЮ
env_melt:{value:1.0}, // ЕСЛИ ТЕКСТУРА НОРМАЛИ РЕЗКАЯ, ТО ВИДНА СИНЕВА С НЕБА, ЧТОБЫ ЕЁ УМЕНЬШИТЬ, УВЕЛИЧИВАЕМ ЭТО ЗНАЧЕНИЕ
env_fresnel_min:{value:0.01}, // МИНИМАЛЬНАЯ ФРИНЕЛЬ
env_fresnel_power:{value:5.0}, // СИЛА ФРИНЕЛЯ
env_intensity:{value:1.0}, // ЯРКОСТЬ ОТРАЖЕНИЯ НЕБА
env_max:{value:1.0}, // МАКСИМАЛЬНЫЙ УРОВЕНЬ ОТРАЖЕНИЯ
env_add_background:{value:0.0}, // НА СКОЛЬКО ДОБАВЛЯТЬ ЦВЕТ ВОДЫ, ЧТОБЫ ВЛИЯЛО НА ОТРАЖЕНИЕ
envMap:{value:scene_envMap_backed.textures[0]}, // ТЕКСТУРА ОТРАЖЕНИЯ
foam_shore_map:{value:tex["water_foam"]}, // ТЕКСТУРА ПЕНА БЕРЕГА
foam_wave_map:{value:tex["water_foam"]}, // ТЕКСТУРА ПЕНА ВОЛНЫ
normal_map:{value:tex["water_normal"]}, // ТЕКСТУРА НОРМАЛИ ИЛИ null
holes_map:{value:null}, // ЧЁРНОБЕЛАЯ ТЕКСТУРА ДЛЯ ОТВЕРСТИЙ В ВОДЕ, ЕСЛИ НЕ НАДО, ТО null
holes_pars:{value:[0.001,0.001,0.5,0.5]}, // [МАСШТАБ ПО X, МАСШТАБ ПО Z, СМЕСТИТЬ UV ПО X, СМЕСТИТЬ UV ПО Z]
depth_offset:{value:0.0}, // ОТСТУП ГЛУБИНЫ
depth_beers_law:{value:-0.1}, // ВЕРХ ГЛУБИНЫ
depth_distance:{value:2.5}, // ПРОЗРАЧНОСТЬ ГЛУБИНЫ
foam_waves_value:{value:[0.1,3.0,1.4]}, // ПЕНА НА ВОЛНАХ [МАСШТАБ ТЕКСТУРЫ,СИЛА,ЯРКОСТЬ]
foam_shore_value:{value:[1.0,0.4,0,0.00002]}, // ПЕНА У БЕРЕГА [ШИРИНА,МАСШТАБ ТЕКСТУРЫ,СКОРОСТЬ ПО X,СКОРОСТЬ ПО Z]
specular:{value:[10,100,720]}, // БЛИКИ СОЛНЦА [ИНТЕНСИВНОСТЬ,СИЛА, КОГДА СОЛНЦЕ ВЫСОКО,СИЛА, КОГДА СОЛНЦЕ НА ГОРИЗОНТЕ]
phong_simple_intensity:{value:0.5}, // ИНТЕНСИВНОСТЬ ПРОСТОГО ФОНГА
scattering_intensity:{value:0.5}, // ИНТЕНСИВНОСТЬ РАССЕИВАНИЯ СВЕТА. ЕСЛИ СТАВИТЬ МНОГО, ТО МОЖЕТ ВЫГЛЯДИТЬ КАК ПЛАСТМАССА
// КАУСТИКА
caustics_map:{value:tex["water_caustic"]}, // ТЕКСТУРА КАУСТИКИ ИЛИ null 
caustics_1_dir_speed:{value:[0,0.0001]}, // [X,Z] НАПРАВЛЕНИЕ И СКОРОСТЬ ПЕРВОЙ КАУСТИКИ
caustics_2_dir_speed:{value:[0,0.0002]}, // [X,Z] НАПРАВЛЕНИЕ И СКОРОСТЬ ВТОРОЙ КАУСТИКИ
caustics_wave:{value:[1,0.1,0.001]}, // ВОЛНА КАУСТИКИ [ЧАСТОТА,МАГНИТУДА,СКОРОСТЬ И НАПАВЛЕНИЕ]
caustics_intensity:{value:2}, // ИНТЕНСИВНОСТЬ
caustics_scale_power:{value:[0.2,1]}, // МАСШТАБ, СИЛА ПРОЯВЛЕНИЯ
caustics_color:{value:new THREE.Color(1.0,1.0,0.4)}, // ЦВЕТ
// ПОД ВОДОЙ
underwater_gradient_offset:1, // НА СКОЛЬКО ОТСТУПИТЬ ГРАДИЕНТУ ОТ ВЕРХА ВОДЫ
underwater_gradient_deep:3, // ГЛУБИНА ГРАДИЕНТА
underwater_top_color_deep:4, // ГЛУБИНА ВЕРХНЕГО ЦВЕТА
underwater_top_color:new THREE.Color(0.0,0.9,0.2), // ВЕРХНИЙ ЦВЕТ
underwater_bottom_color:new THREE.Color(0.0,0.45,0.45), // НИЖНИЙ ЦВЕТ
underwater_sun_flare_color:new THREE.Color(1.0,1.0,0.2), // ЦВЕТ СИЯНИЯ СОЛНЦА
underwater_sun_flare_intensity:0.5, // ИНТЕНСИВНОСТЬ СИЯНИЯ СОЛНЦА
underwater_darkness_deep:20, // ГЛУБИНА ТЕМНОТЫ
underwater_depth_distance:30, // ПРОЗРАЧНОСТЬ ГЛУБИНЫ
gamma:{value:1.0}, // ГАММА
saturation:{value:1.0}, // НАСЫЩЕННОСТЬ
normal_far_smoothing:{value:[250,200]}, // СГЛАЖИВАНИЕ НОРМАЛИ ВДАЛИ [ДИСТАНЦИЯ ОТ,ПРОТЯЖЁННОСТЬ]
sky_far_mix_value:{value:[450,500]}, // СМЕШИВАНИЕ НЕБА С ВОДОЙ ВДАЛИ [ДИСТАНЦИЯ ОТ,ДИСТАНЦИЯ ДО]
// ИСПОЛЬЗОВАТЬ ЛИ ЭТИ ФУНКЦИИ
use_transparent_style:true, // FALSE - ОБЫЧНАЯ ВОДА, TRUE - ПОЛНОСТЬЮ ПРОЗРАЧНАЯ
refraction:1, // 0 - НЕ ИСПОЛЬЗОВАТЬ РЕФРАКЦИЮ, 1 - ИСПОЛЬЗОВАТЬ, НО ПЛОСКУЮ ИЗ 2 ТРЕУГОЛЬНИКОВ, 2 - ИЗ ВСЕХ ТРЕУГОЛЬНИКОВ ВОЛН
use_waves:false, // ВОЛНЫ ГЕРСТНЕРА
use_sss:false, // ПОДПОВЕРХНОСТНОЕ РАССЕИВАНИЕ СВЕТА
use_shore_smoothing:true, // СГЛАЖИВАНИЕ БЕРЕГА  
use_caustics:true, // КАУСТИКА
use_fog:true, // ТУМАН
use_wave_color:true, // ЦВЕТ ВОЛНЫ
use_foam_waves:true, // ПЕНА НА ВОЛНАХ
use_foam_shore:true, // ПЕНА У БЕРЕГА И ОБЪЕКТОВ 
use_gamma:false, // ГАММА
use_saturation:false, // НАСЫЩЕННОСТЬ
use_back:true, // ОБРАТНАЯ СТОРОНА
use_shadows:true, // ТЕНИ
use_sky_far_mix:true, // СМЕШИВАНИЕ НЕБА С ВОДОЙ ВДАЛИ
use_specular:true, // БЛИКИ СОЛНЦА
use_phong_simple:true, // ИНТЕНСИВНОСТЬ ПРОСТОГО ФОНГА
use_scattering:true, // ИНТЕНСИВНОСТЬ РАССЕИВАНИЯ СВЕТА
use_shore_transparent:true, // ПРОЗРАЧНОСТЬ БЕРЕГА
use_underwater_sun_flare:true, // ПОД ВОДОЙ СИЯНИЕ СОЛНЦА
}


water["sea"]={
from_mesh:null, // ПРЕВРАТИТЬ ОБЪЕКТ В ВОДУ, ИНАЧЕ null
width:80, // ШИРИНА 
depth:90, // ДЛИНА	
deep:10, // ГЛУБИНА
position:{x:180,y:-3,z:145}, // ПОЗИЦИЯ
// [РАЗМЕР ЯЧЕЙКИ LOD МОЖЕТ БЫТЬ И 0 - ТОГДА БУДЕТ ПЛОСКОСТЬ ИЗ 2 ТРЕУГОЛЬНИКОВ, РАССТОЯНИЕ ДО ЦЕНТРА LOD]
// ДЛЯ ПЕРВОГО LOD РАССТОЯНИЕ ДО ЦЕНТРА МОЖНО НЕ УКАЗЫВАТЬ
// ДОПУСТИМЫЕ РАЗМЕРЫ ЯЧЕЙКИ: 0.125,0.25,0.5,1,2,4,8,16,32,64
// ПРИМЕР: cells_size:[[0.25,20]], БЕЗ LOD
// ПРИМЕР: cells_size:[[0.25,20],[0.25,100],[0,200]], 3 LOD 
// ЕСЛИ НУЖНА ПЛОСКАЯ ВОДА, ТО СТАВИМ: cells_size:[[0,0]], И use_waves:false
cells_size:[[1.0,0],[2.0,100],[4.0,150],[8.0,200]],
// ВОЛНЫ ГЕРСТНЕРА
gerstner_waves:[new THREE.Vector4(-1.0,-1.0,0.05,60.0),new THREE.Vector4(-1.0,-0.6,0.05,31.0),new THREE.Vector4(-1.0,-1.3,0.05,18.0)],
gerstner_waves_speed:{value:0.001}, // СКОРОСТЬ ВОЛН
water_top_color:{value:new THREE.Color(0.05,0.12,0.2)}, // ЦВЕТ ВОДЫ ВЕРХНИЙ			
water_bottom_color:{value:new THREE.Color(0.05,0.12,0.2)}, // ЦВЕТ ВОДЫ НИЖНИЙ	
shore_transparent:{value:0.4}, // ПРОЗРАЧНОСТЬ БЕРЕГА 0-1
wave_color:{value:new THREE.Color(0.0,0.6,0.6).convertSRGBToLinear()}, // ЦВЕТ ВОЛНЫ
wave_color_power:{value:1.5}, // ФРИНЕЛЬ ЦВЕТА ВОЛНЫ
sss_color:{value:new THREE.Color(0.0,1.0,1.0)}, // ЦВЕТ ПОДПОВЕРХНОСТНОГО РАССЕИВАНИЯ СВЕТА
sss_value:{value:[0.66,5.0,10.0,0.01]}, // ПОДПОВЕРХНОСТНОЕ РАССЕИВАНИЕ СВЕТА [ИСКАЖЕНИЕ,ФРИНЕЛЬ,ИНТЕНСИВНОСТЬ,УМЕНЬШЕНИЕ ВЫСОТЫ СОЛНЦА ДЛЯ СОХРАНЕНИЯ ЭФФЕКТА]
shore_smoothing_intensity:{value:10.0}, // СГЛАЖИВАНИЕ БЕРЕГА 
refraction_value:{value:[0.05,10.0]}, // РЕФРАКЦИЯ [ИНТЕНСИНОВСТЬ,УМЕНЬШЕНИЕ РЕФРАКЦИИ У БЕРЕГА] 
// НОРМАЛЬ
normal_a_value:{value:[0.2,0,0.00015]}, // МЕЛКАЯ НОРМАЛЬ A [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_b_value:{value:[0.1,0,-0.00010]}, // МЕЛКАЯ НОРМАЛЬ B [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_ab:{value:1.0}, // ПЕРЕВОРОТ НОРМАЛИ ПО Y ЧЕРЕЗ -1. А ТАКЖЕ УМЕНЬШЕНИЕ ИНТЕНСИВНОСТЬ
normal_c_value:{value:[0.02,0,0.00010]}, // БОЛЬШАЯ НОРМАЛЬ C [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_d_value:{value:[0.01,0,-0.00005]}, // БОЛЬШАЯ НОРМАЛЬ D [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_cd:{value:1.0}, // ПЕРЕВОРОТ НОРМАЛИ ПО Y ЧЕРЕЗ -1. А ТАКЖЕ УМЕНЬШЕНИЕ ИНТЕНСИВНОСТЬ
normal_small_far_total:{value:[0.5,0.1]}, // НАСКОЛЬКО СМЕШАТЬ МАЛУЮ НОРМАЛЬ С БОЛЬШОЙ НОРМАЛЬЮ, И НА СКОЛЬКО СМЕШАТЬ ИХ С ВЕРШИННЫМИ ВОЛНАМ
// ОТРАЖЕНИЕ
env_mix:{value:1.0}, // НАСКОЛЬКО СИЛЬНО СМЕШИВАТЬ ОСНОВНУЮ НОРМАЛЬ С ТЕКСТУРНОЙ НОРМАЛЬЮ
env_melt:{value:1.0}, // ЕСЛИ ТЕКСТУРА НОРМАЛИ РЕЗКАЯ, ТО ВИДНА СИНЕВА С НЕБА, ЧТОБЫ ЕЁ УМЕНЬШИТЬ, УВЕЛИЧИВАЕМ ЭТО ЗНАЧЕНИЕ
env_fresnel_min:{value:0.01}, // МИНИМАЛЬНАЯ ФРИНЕЛЬ
env_fresnel_power:{value:0.0}, // СИЛА ФРИНЕЛЯ
env_intensity:{value:1.0}, // ЯРКОСТЬ ОТРАЖЕНИЯ НЕБА
env_max:{value:1.0}, // МАКСИМАЛЬНЫЙ УРОВЕНЬ ОТРАЖЕНИЯ
env_add_background:{value:0.0}, // НА СКОЛЬКО ДОБАВЛЯТЬ ЦВЕТ ВОДЫ, ЧТОБЫ ВЛИЯЛО НА ОТРАЖЕНИЕ
envMap:{value:scene_envMap_backed.textures[0]}, // ТЕКСТУРА ОТРАЖЕНИЯ
foam_shore_map:{value:tex["water_foam"]}, // ТЕКСТУРА ПЕНА БЕРЕГА
foam_wave_map:{value:tex["water_foam"]}, // ТЕКСТУРА ПЕНА ВОЛНЫ
normal_map:{value:tex["water_normal"]}, // ТЕКСТУРА НОРМАЛИ ИЛИ null
holes_map:{value:null}, // ЧЁРНОБЕЛАЯ ТЕКСТУРА ДЛЯ ОТВЕРСТИЙ В ВОДЕ, ЕСЛИ НЕ НАДО, ТО null
holes_pars:{value:[0.001,0.001,0.5,0.5]}, // [МАСШТАБ ПО X, МАСШТАБ ПО Z, СМЕСТИТЬ UV ПО X, СМЕСТИТЬ UV ПО Z]
depth_offset:{value:0.0}, // ОТСТУП ГЛУБИНЫ
depth_beers_law:{value:-0.1}, // ВЕРХ ГЛУБИНЫ
depth_distance:{value:2.5}, // ПРОЗРАЧНОСТЬ ГЛУБИНЫ
foam_waves_value:{value:[0.1,3.0,1.4]}, // ПЕНА НА ВОЛНАХ [МАСШТАБ ТЕКСТУРЫ,СИЛА,ЯРКОСТЬ]
foam_shore_value:{value:[1.0,0.4,0,0.00002]}, // ПЕНА У БЕРЕГА [ШИРИНА,МАСШТАБ ТЕКСТУРЫ,СКОРОСТЬ ПО X,СКОРОСТЬ ПО Z]
specular:{value:[10,100,720]}, // БЛИКИ СОЛНЦА [ИНТЕНСИВНОСТЬ,СИЛА, КОГДА СОЛНЦЕ ВЫСОКО,СИЛА, КОГДА СОЛНЦЕ НА ГОРИЗОНТЕ]
phong_simple_intensity:{value:0.5}, // ИНТЕНСИВНОСТЬ ПРОСТОГО ФОНГА
scattering_intensity:{value:0.5}, // ИНТЕНСИВНОСТЬ РАССЕИВАНИЯ СВЕТА. ЕСЛИ СТАВИТЬ МНОГО, ТО МОЖЕТ ВЫГЛЯДИТЬ КАК ПЛАСТМАССА
// КАУСТИКА
caustics_map:{value:tex["water_caustic"]}, // ТЕКСТУРА КАУСТИКИ ИЛИ null 
caustics_1_dir_speed:{value:[0,0.0001]}, // [X,Z] НАПРАВЛЕНИЕ И СКОРОСТЬ ПЕРВОЙ КАУСТИКИ
caustics_2_dir_speed:{value:[0,0.0002]}, // [X,Z] НАПРАВЛЕНИЕ И СКОРОСТЬ ВТОРОЙ КАУСТИКИ
caustics_wave:{value:[1,0.1,0.001]}, // ВОЛНА КАУСТИКИ [ЧАСТОТА,МАГНИТУДА,СКОРОСТЬ И НАПАВЛЕНИЕ]
caustics_intensity:{value:2}, // ИНТЕНСИВНОСТЬ
caustics_scale_power:{value:[0.2,1]}, // МАСШТАБ, СИЛА ПРОЯВЛЕНИЯ
caustics_color:{value:new THREE.Color(1.0,1.0,0.4)}, // ЦВЕТ
// ПОД ВОДОЙ
underwater_gradient_offset:1, // НА СКОЛЬКО ОТСТУПИТЬ ГРАДИЕНТУ ОТ ВЕРХА ВОДЫ
underwater_gradient_deep:3, // ГЛУБИНА ГРАДИЕНТА
underwater_top_color_deep:4, // ГЛУБИНА ВЕРХНЕГО ЦВЕТА
underwater_top_color:new THREE.Color(0.0,0.9,0.2), // ВЕРХНИЙ ЦВЕТ
underwater_bottom_color:new THREE.Color(0.05,0.12,0.2), // НИЖНИЙ ЦВЕТ
underwater_sun_flare_color:new THREE.Color(1.0,1.0,0.2), // ЦВЕТ СИЯНИЯ СОЛНЦА
underwater_sun_flare_intensity:0.5, // ИНТЕНСИВНОСТЬ СИЯНИЯ СОЛНЦА
underwater_darkness_deep:20, // ГЛУБИНА ТЕМНОТЫ
underwater_depth_distance:30, // ПРОЗРАЧНОСТЬ ГЛУБИНЫ
gamma:{value:1.0}, // ГАММА
saturation:{value:1.0}, // НАСЫЩЕННОСТЬ
normal_far_smoothing:{value:[250,200]}, // СГЛАЖИВАНИЕ НОРМАЛИ ВДАЛИ [ДИСТАНЦИЯ ОТ,ПРОТЯЖЁННОСТЬ]
sky_far_mix_value:{value:[450,500]}, // СМЕШИВАНИЕ НЕБА С ВОДОЙ ВДАЛИ [ДИСТАНЦИЯ ОТ,ДИСТАНЦИЯ ДО]
// ИСПОЛЬЗОВАТЬ ЛИ ЭТИ ФУНКЦИИ
use_transparent_style:false, // FALSE - ОБЫЧНАЯ ВОДА, TRUE - ПОЛНОСТЬЮ ПРОЗРАЧНАЯ
refraction:2, // 0 - НЕ ИСПОЛЬЗОВАТЬ РЕФРАКЦИЮ, 1 - ИСПОЛЬЗОВАТЬ, НО ПЛОСКУЮ ИЗ 2 ТРЕУГОЛЬНИКОВ, 2 - ИЗ ВСЕХ ТРЕУГОЛЬНИКОВ ВОЛН
use_waves:true, // ВОЛНЫ ГЕРСТНЕРА
use_sss:false, // ПОДПОВЕРХНОСТНОЕ РАССЕИВАНИЕ СВЕТА
use_shore_smoothing:true, // СГЛАЖИВАНИЕ БЕРЕГА  
use_caustics:false, // КАУСТИКА
use_fog:true, // ТУМАН
use_wave_color:false, // ЦВЕТ ВОЛНЫ
use_foam_waves:true, // ПЕНА НА ВОЛНАХ
use_foam_shore:true, // ПЕНА У БЕРЕГА И ОБЪЕКТОВ 
use_gamma:false, // ГАММА
use_saturation:false, // НАСЫЩЕННОСТЬ
use_back:true, // ОБРАТНАЯ СТОРОНА
use_shadows:true, // ТЕНИ
use_sky_far_mix:true, // СМЕШИВАНИЕ НЕБА С ВОДОЙ ВДАЛИ
use_specular:true, // БЛИКИ СОЛНЦА
use_phong_simple:true, // ИНТЕНСИВНОСТЬ ПРОСТОГО ФОНГА
use_scattering:true, // ИНТЕНСИВНОСТЬ РАССЕИВАНИЯ СВЕТА
use_shore_transparent:true, // ПРОЗРАЧНОСТЬ БЕРЕГА
use_underwater_sun_flare:true, // ПОД ВОДОЙ СИЯНИЕ СОЛНЦА
}


water["river"]={
from_mesh:null, // ПРЕВРАТИТЬ ОБЪЕКТ В ВОДУ, ИНАЧЕ null
width:40, // ШИРИНА 
depth:70, // ДЛИНА	
deep:10, // ГЛУБИНА
position:{x:120,y:-2,z:125}, // ПОЗИЦИЯ
// [РАЗМЕР ЯЧЕЙКИ LOD МОЖЕТ БЫТЬ И 0 - ТОГДА БУДЕТ ПЛОСКОСТЬ ИЗ 2 ТРЕУГОЛЬНИКОВ, РАССТОЯНИЕ ДО ЦЕНТРА LOD]
// ДЛЯ ПЕРВОГО LOD РАССТОЯНИЕ ДО ЦЕНТРА МОЖНО НЕ УКАЗЫВАТЬ
// ДОПУСТИМЫЕ РАЗМЕРЫ ЯЧЕЙКИ: 0.125,0.25,0.5,1,2,4,8,16,32,64
// ПРИМЕР: cells_size:[[0.25,20]], БЕЗ LOD
// ПРИМЕР: cells_size:[[0.25,20],[0.25,100],[0,200]], 3 LOD 
// ЕСЛИ НУЖНА ПЛОСКАЯ ВОДА, ТО СТАВИМ: cells_size:[[0,0]], И use_waves:false
cells_size:[[0,0]],
// ВОЛНЫ ГЕРСТНЕРА
gerstner_waves:[new THREE.Vector4(-1.0,-1.0,0.05,60.0),new THREE.Vector4(-1.0,-0.6,0.05,31.0),new THREE.Vector4(-1.0,-1.3,0.05,18.0)],
gerstner_waves_speed:{value:0.001}, // СКОРОСТЬ ВОЛН
water_top_color:{value:new THREE.Color(0.0,0.96,0.48).convertSRGBToLinear()}, // ЦВЕТ ВОДЫ ВЕРХНИЙ				
water_bottom_color:{value:new THREE.Color(0.0,0.7,0.7).convertSRGBToLinear()}, // ЦВЕТ ВОДЫ НИЖНИЙ	
shore_transparent:{value:0.4}, // ПРОЗРАЧНОСТЬ БЕРЕГА 0-1
wave_color:{value:new THREE.Color(0.0,0.6,0.6).convertSRGBToLinear()}, // ЦВЕТ ВОЛНЫ
wave_color_power:{value:1.5}, // ФРИНЕЛЬ ЦВЕТА ВОЛНЫ
sss_color:{value:new THREE.Color(0.0,1.0,1.0)}, // ЦВЕТ ПОДПОВЕРХНОСТНОГО РАССЕИВАНИЯ СВЕТА
sss_value:{value:[0.66,5.0,10.0,0.01]}, // ПОДПОВЕРХНОСТНОЕ РАССЕИВАНИЕ СВЕТА [ИСКАЖЕНИЕ,ФРИНЕЛЬ,ИНТЕНСИВНОСТЬ,УМЕНЬШЕНИЕ ВЫСОТЫ СОЛНЦА ДЛЯ СОХРАНЕНИЯ ЭФФЕКТА]
shore_smoothing_intensity:{value:10.0}, // СГЛАЖИВАНИЕ БЕРЕГА 
refraction_value:{value:[0.05,10.0]}, // РЕФРАКЦИЯ [ИНТЕНСИНОВСТЬ,УМЕНЬШЕНИЕ РЕФРАКЦИИ У БЕРЕГА] 
// НОРМАЛЬ
normal_a_value:{value:[0.2,0,0.00015]}, // МЕЛКАЯ НОРМАЛЬ A [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_b_value:{value:[0.1,0,-0.00010]}, // МЕЛКАЯ НОРМАЛЬ B [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_ab:{value:1.0}, // ПЕРЕВОРОТ НОРМАЛИ ПО Y ЧЕРЕЗ -1. А ТАКЖЕ УМЕНЬШЕНИЕ ИНТЕНСИВНОСТЬ
normal_c_value:{value:[0.02,0,0.00010]}, // БОЛЬШАЯ НОРМАЛЬ C [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_d_value:{value:[0.01,0,-0.00005]}, // БОЛЬШАЯ НОРМАЛЬ D [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_cd:{value:1.0}, // ПЕРЕВОРОТ НОРМАЛИ ПО Y ЧЕРЕЗ -1. А ТАКЖЕ УМЕНЬШЕНИЕ ИНТЕНСИВНОСТЬ
normal_small_far_total:{value:[0.5,0.1]}, // НАСКОЛЬКО СМЕШАТЬ МАЛУЮ НОРМАЛЬ С БОЛЬШОЙ НОРМАЛЬЮ, И НА СКОЛЬКО СМЕШАТЬ ИХ С ВЕРШИННЫМИ ВОЛНАМ
// ОТРАЖЕНИЕ
env_mix:{value:1.0}, // НАСКОЛЬКО СИЛЬНО СМЕШИВАТЬ ОСНОВНУЮ НОРМАЛЬ С ТЕКСТУРНОЙ НОРМАЛЬЮ
env_melt:{value:1.0}, // ЕСЛИ ТЕКСТУРА НОРМАЛИ РЕЗКАЯ, ТО ВИДНА СИНЕВА С НЕБА, ЧТОБЫ ЕЁ УМЕНЬШИТЬ, УВЕЛИЧИВАЕМ ЭТО ЗНАЧЕНИЕ
env_fresnel_min:{value:0.01}, // МИНИМАЛЬНАЯ ФРИНЕЛЬ
env_fresnel_power:{value:5.0}, // СИЛА ФРИНЕЛЯ
env_intensity:{value:1.0}, // ЯРКОСТЬ ОТРАЖЕНИЯ НЕБА
env_max:{value:1.0}, // МАКСИМАЛЬНЫЙ УРОВЕНЬ ОТРАЖЕНИЯ
env_add_background:{value:0.0}, // НА СКОЛЬКО ДОБАВЛЯТЬ ЦВЕТ ВОДЫ, ЧТОБЫ ВЛИЯЛО НА ОТРАЖЕНИЕ
envMap:{value:scene_envMap_backed.textures[0]}, // ТЕКСТУРА ОТРАЖЕНИЯ
foam_shore_map:{value:tex["water_foam"]}, // ТЕКСТУРА ПЕНА БЕРЕГА
foam_wave_map:{value:tex["water_foam"]}, // ТЕКСТУРА ПЕНА ВОЛНЫ
normal_map:{value:tex["water_normal"]}, // ТЕКСТУРА НОРМАЛИ ИЛИ null
holes_map:{value:null}, // ЧЁРНОБЕЛАЯ ТЕКСТУРА ДЛЯ ОТВЕРСТИЙ В ВОДЕ, ЕСЛИ НЕ НАДО, ТО null
holes_pars:{value:[0.001,0.001,0.5,0.5]}, // [МАСШТАБ ПО X, МАСШТАБ ПО Z, СМЕСТИТЬ UV ПО X, СМЕСТИТЬ UV ПО Z]
depth_offset:{value:0.0}, // ОТСТУП ГЛУБИНЫ
depth_beers_law:{value:-0.1}, // ВЕРХ ГЛУБИНЫ
depth_distance:{value:2.5}, // ПРОЗРАЧНОСТЬ ГЛУБИНЫ
foam_waves_value:{value:[0.1,3.0,1.4]}, // ПЕНА НА ВОЛНАХ [МАСШТАБ ТЕКСТУРЫ,СИЛА,ЯРКОСТЬ]
foam_shore_value:{value:[1.0,0.4,0,0.00002]}, // ПЕНА У БЕРЕГА [ШИРИНА,МАСШТАБ ТЕКСТУРЫ,СКОРОСТЬ ПО X,СКОРОСТЬ ПО Z]
specular:{value:[10,100,720]}, // БЛИКИ СОЛНЦА [ИНТЕНСИВНОСТЬ,СИЛА, КОГДА СОЛНЦЕ ВЫСОКО,СИЛА, КОГДА СОЛНЦЕ НА ГОРИЗОНТЕ]
phong_simple_intensity:{value:0.5}, // ИНТЕНСИВНОСТЬ ПРОСТОГО ФОНГА
scattering_intensity:{value:0.5}, // ИНТЕНСИВНОСТЬ РАССЕИВАНИЯ СВЕТА. ЕСЛИ СТАВИТЬ МНОГО, ТО МОЖЕТ ВЫГЛЯДИТЬ КАК ПЛАСТМАССА
// КАУСТИКА
caustics_map:{value:tex["water_caustic"]}, // ТЕКСТУРА КАУСТИКИ ИЛИ null 
caustics_1_dir_speed:{value:[0,0.0001]}, // [X,Z] НАПРАВЛЕНИЕ И СКОРОСТЬ ПЕРВОЙ КАУСТИКИ
caustics_2_dir_speed:{value:[0,0.0002]}, // [X,Z] НАПРАВЛЕНИЕ И СКОРОСТЬ ВТОРОЙ КАУСТИКИ
caustics_wave:{value:[1,0.1,0.001]}, // ВОЛНА КАУСТИКИ [ЧАСТОТА,МАГНИТУДА,СКОРОСТЬ И НАПАВЛЕНИЕ]
caustics_intensity:{value:2}, // ИНТЕНСИВНОСТЬ
caustics_scale_power:{value:[0.2,1]}, // МАСШТАБ, СИЛА ПРОЯВЛЕНИЯ
caustics_color:{value:new THREE.Color(1.0,1.0,0.4)}, // ЦВЕТ
// ПОД ВОДОЙ
underwater_gradient_offset:1, // НА СКОЛЬКО ОТСТУПИТЬ ГРАДИЕНТУ ОТ ВЕРХА ВОДЫ
underwater_gradient_deep:5, // ГЛУБИНА ГРАДИЕНТА
underwater_top_color_deep:4, // ГЛУБИНА ВЕРХНЕГО ЦВЕТА
underwater_top_color:new THREE.Color(0.0,0.9,0.2), // ВЕРХНИЙ ЦВЕТ
underwater_bottom_color:new THREE.Color(0.0,0.45,0.45), // НИЖНИЙ ЦВЕТ
underwater_sun_flare_color:new THREE.Color(1.0,1.0,0.2), // ЦВЕТ СИЯНИЯ СОЛНЦА
underwater_sun_flare_intensity:0.5, // ИНТЕНСИВНОСТЬ СИЯНИЯ СОЛНЦА
underwater_darkness_deep:20, // ГЛУБИНА ТЕМНОТЫ
underwater_depth_distance:30, // ПРОЗРАЧНОСТЬ ГЛУБИНЫ
gamma:{value:1.0}, // ГАММА
saturation:{value:1.0}, // НАСЫЩЕННОСТЬ
normal_far_smoothing:{value:[250,200]}, // СГЛАЖИВАНИЕ НОРМАЛИ ВДАЛИ [ДИСТАНЦИЯ ОТ,ПРОТЯЖЁННОСТЬ]
sky_far_mix_value:{value:[450,500]}, // СМЕШИВАНИЕ НЕБА С ВОДОЙ ВДАЛИ [ДИСТАНЦИЯ ОТ,ДИСТАНЦИЯ ДО]
// ИСПОЛЬЗОВАТЬ ЛИ ЭТИ ФУНКЦИИ
use_transparent_style:false, // FALSE - ОБЫЧНАЯ ВОДА, TRUE - ПОЛНОСТЬЮ ПРОЗРАЧНАЯ
refraction:1, // 0 - НЕ ИСПОЛЬЗОВАТЬ РЕФРАКЦИЮ, 1 - ИСПОЛЬЗОВАТЬ, НО ПЛОСКУЮ ИЗ 2 ТРЕУГОЛЬНИКОВ, 2 - ИЗ ВСЕХ ТРЕУГОЛЬНИКОВ ВОЛН
use_waves:false, // ВОЛНЫ ГЕРСТНЕРА
use_sss:false, // ПОДПОВЕРХНОСТНОЕ РАССЕИВАНИЕ СВЕТА
use_shore_smoothing:true, // СГЛАЖИВАНИЕ БЕРЕГА  
use_caustics:true, // КАУСТИКА
use_fog:true, // ТУМАН
use_wave_color:true, // ЦВЕТ ВОЛНЫ
use_foam_waves:true, // ПЕНА НА ВОЛНАХ
use_foam_shore:true, // ПЕНА У БЕРЕГА И ОБЪЕКТОВ 
use_gamma:false, // ГАММА
use_saturation:false, // НАСЫЩЕННОСТЬ
use_back:true, // ОБРАТНАЯ СТОРОНА
use_shadows:true, // ТЕНИ
use_sky_far_mix:true, // СМЕШИВАНИЕ НЕБА С ВОДОЙ ВДАЛИ
use_specular:true, // БЛИКИ СОЛНЦА
use_phong_simple:true, // ИНТЕНСИВНОСТЬ ПРОСТОГО ФОНГА
use_scattering:true, // ИНТЕНСИВНОСТЬ РАССЕИВАНИЯ СВЕТА
use_shore_transparent:true, // ПРОЗРАЧНОСТЬ БЕРЕГА
use_underwater_sun_flare:true, // ПОД ВОДОЙ СИЯНИЕ СОЛНЦА
}


water["ocean"]={ // НАЗВАНИЕ ocean НЕ МЕНЯТЬ
hide:mesh["hide_ocean_waterline"], // ГЕОМЕТРИЯ, ГДЕ НЕ ДОЛЖНО БЫТЬ ВОДНОЙ ЛИНИИ ОКЕАНА, ЧТОБЫ ОНА НЕ ПОЯВЛЯЛАСЬ НА ОЗЕРЕ. ИЛИ null
position:{y:-1}, // ПОЗИЦИЯ ПО ВЫСОТЕ
deep:500, // ГЛУБИНА
cells_size:2.0, // РАЗМЕР ЯЧЕЙКИ ПЕРВОГО LOD В МЕТРАХ. ДОПУСТИМЫЕ РАЗМЕРЫ: 0.125,0.25,0.5,1,2,4,8,16,32,64
//ЕСЛИ НУЖЕН ПЛОСКИЙ ОКЕАН ИЗ 2 ТРЕУГОЛЬНИКОВ, ТО СТАВИМ cells_size:500, cells_amount:1, lod:[], use_waves:false
//ПОДБИРАТЬ ЧЁТНОЕ КОЛИЧЕСТВО ЯЧЕЕК, ПРИ КОТОРОМ ТРЕУГОЛЬНИКИ ОКЕАНА НЕ БУДУТ НАЕЗЖАТЬ ДРУГ НА ДРУГА, НАПРИМЕР, cells_amount НЕ 50, А 40
cells_amount:100, // ЧЁТНОЕ КОЛИЧЕСТВО ЯЧЕЕК ПЕРВОГО LOD
lod:[80,10], // КОЛИЧЕСТВО ЯЧЕЕК LOD. МАКСИМУМ 2 LOD
last_lod_stretch:50, // НА СКОЛЬКО МЕТРОВ РАСТЯНУТЬ ЯЧЕЙКИ ПОСЛЕДНЕГО LOD ЧТОБЫ ПОКРЫТЬ ДАЛЬНОСТЬ ОБЗОРА И СЭКОНОМИТЬ ТРЕУГОЛЬНИКИ
// ВОЛНЫ ГЕРСТНЕРА
//gerstner_waves:gerstner_waves_gen(12,1.1,0,1232.399963,0.02,5).concat(gerstner_waves_gen(3,1.3,0,1232.399963,0.05,60)),
gerstner_waves:[new THREE.Vector4(-1.0,-1.0,0.05,60.0),new THREE.Vector4(-1.0,-0.6,0.05,31.0),new THREE.Vector4(-1.0,-1.3,0.05,18.0)],
gerstner_waves_speed:{value:0.001}, // СКОРОСТЬ ВОЛН
ocean_move:16, // ШАГ СЛЕДОВАНИЯ ОКЕАНА ЗА КАМЕРОЙ, ЧТОБЫ НЕ БЫЛО ЗАМЕТНО ДЁРГАНИЕ
water_top_color:{value:new THREE.Color(0.0,0.96,0.48).convertSRGBToLinear()}, // ЦВЕТ ВОДЫ ВЕРХНИЙ	
water_bottom_color:{value:new THREE.Color(0.0,0.4,0.2).convertSRGBToLinear()}, // ЦВЕТ ВОДЫ НИЖНИЙ		
shore_transparent:{value:0.4}, // ПРОЗРАЧНОСТЬ БЕРЕГА 0-1
wave_color:{value:new THREE.Color(0.0,0.6,0.0).convertSRGBToLinear()}, // ЦВЕТ ВОЛНЫ
wave_color_power:{value:1.5}, // ФРИНЕЛЬ ЦВЕТА ВОЛНЫ
sss_color:{value:new THREE.Color(0.0,0.5,0.0)}, // ЦВЕТ ПОДПОВЕРХНОСТНОГО РАССЕИВАНИЯ СВЕТА
sss_value:{value:[0.66,5.0,10.0,0.01]}, // ПОДПОВЕРХНОСТНОЕ РАССЕИВАНИЕ СВЕТА [ИСКАЖЕНИЕ,ФРИНЕЛЬ,ИНТЕНСИВНОСТЬ,УМЕНЬШЕНИЕ ВЫСОТЫ СОЛНЦА ДЛЯ СОХРАНЕНИЯ ЭФФЕКТА]
shore_smoothing_intensity:{value:10.0}, // СГЛАЖИВАНИЕ БЕРЕГА 
refraction_value:{value:[0.05,10.0]}, // РЕФРАКЦИЯ [ИНТЕНСИНОВСТЬ,УМЕНЬШЕНИЕ РЕФРАКЦИИ У БЕРЕГА] 
// НОРМАЛЬ
normal_a_value:{value:[0.2,0,0.00015]}, // МЕЛКАЯ НОРМАЛЬ A [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_b_value:{value:[0.1,0,-0.00010]}, // МЕЛКАЯ НОРМАЛЬ B [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_ab:{value:1.0}, // ПЕРЕВОРОТ НОРМАЛИ ПО Y ЧЕРЕЗ -1. А ТАКЖЕ УМЕНЬШЕНИЕ ИНТЕНСИВНОСТЬ
normal_c_value:{value:[0.02,0,0.00010]}, // БОЛЬШАЯ НОРМАЛЬ C [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_d_value:{value:[0.01,0,-0.00005]}, // БОЛЬШАЯ НОРМАЛЬ D [МАСШТАБ,СКОРОСТЬ X,СКОРОСТЬ Z]
normal_cd:{value:1.0}, // ПЕРЕВОРОТ НОРМАЛИ ПО Y ЧЕРЕЗ -1. А ТАКЖЕ УМЕНЬШЕНИЕ ИНТЕНСИВНОСТЬ
normal_small_far_total:{value:[0.5,0.1]}, // НАСКОЛЬКО СМЕШАТЬ МАЛУЮ НОРМАЛЬ С БОЛЬШОЙ НОРМАЛЬЮ, И НА СКОЛЬКО СМЕШАТЬ ИХ С ВЕРШИННЫМИ ВОЛНАМ
// ОТРАЖЕНИЕ
env_mix:{value:1.0}, // НАСКОЛЬКО СИЛЬНО СМЕШИВАТЬ ОСНОВНУЮ НОРМАЛЬ С ТЕКСТУРНОЙ НОРМАЛЬЮ
env_melt:{value:1.0}, // ЕСЛИ ТЕКСТУРА НОРМАЛИ РЕЗКАЯ, ТО ВИДНА СИНЕВА С НЕБА, ЧТОБЫ ЕЁ УМЕНЬШИТЬ, УВЕЛИЧИВАЕМ ЭТО ЗНАЧЕНИЕ
env_fresnel_min:{value:0.01}, // МИНИМАЛЬНАЯ ФРИНЕЛЬ
env_fresnel_power:{value:5.0}, // СИЛА ФРИНЕЛЯ
env_intensity:{value:1.0}, // ЯРКОСТЬ ОТРАЖЕНИЯ НЕБА
env_max:{value:1.0}, // МАКСИМАЛЬНЫЙ УРОВЕНЬ ОТРАЖЕНИЯ
env_add_background:{value:0.0}, // НА СКОЛЬКО ДОБАВЛЯТЬ ЦВЕТ ВОДЫ, ЧТОБЫ ВЛИЯЛО НА ОТРАЖЕНИЕ
envMap:{value:scene_envMap_backed.textures[0]}, // ТЕКСТУРА ОТРАЖЕНИЯ
foam_shore_map:{value:tex["water_foam"]}, // ТЕКСТУРА ПЕНА БЕРЕГА
foam_wave_map:{value:tex["water_foam"]}, // ТЕКСТУРА ПЕНА ВОЛНЫ
normal_map:{value:tex["water_normal"]}, // ТЕКСТУРА НОРМАЛИ ИЛИ null
holes_map:{value:tex["ocean_holes"]}, // ЧЁРНОБЕЛАЯ ТЕКСТУРА ДЛЯ ОТВЕРСТИЙ В ВОДЕ, ЕСЛИ НЕ НАДО, ТО null
holes_pars:{value:[0.001,0.001,0.5,0.5]}, // [МАСШТАБ ПО X, МАСШТАБ ПО Z, СМЕСТИТЬ UV ПО X, СМЕСТИТЬ UV ПО Z]
depth_offset:{value:0.0}, // ОТСТУП ГЛУБИНЫ
depth_beers_law:{value:-0.1}, // ВЕРХ ГЛУБИНЫ
depth_distance:{value:2.5}, // ПРОЗРАЧНОСТЬ ГЛУБИНЫ
foam_waves_value:{value:[0.1,3.0,1.4]}, // ПЕНА НА ВОЛНАХ [МАСШТАБ ТЕКСТУРЫ,СИЛА,ЯРКОСТЬ]
foam_shore_value:{value:[1.0,0.4,0,0.00002]}, // ПЕНА У БЕРЕГА [ШИРИНА,МАСШТАБ ТЕКСТУРЫ,СКОРОСТЬ ПО X,СКОРОСТЬ ПО Z]
specular:{value:[10,100,720]}, // БЛИКИ СОЛНЦА [ИНТЕНСИВНОСТЬ,СИЛА, КОГДА СОЛНЦЕ ВЫСОКО,СИЛА, КОГДА СОЛНЦЕ НА ГОРИЗОНТЕ]
phong_simple_intensity:{value:0.5}, // ИНТЕНСИВНОСТЬ ПРОСТОГО ФОНГА
scattering_intensity:{value:0.5}, // ИНТЕНСИВНОСТЬ РАССЕИВАНИЯ СВЕТА. ЕСЛИ СТАВИТЬ МНОГО, ТО МОЖЕТ ВЫГЛЯДИТЬ КАК ПЛАСТМАССА
// КАУСТИКА
caustics_map:{value:tex["water_caustic"]}, // ТЕКСТУРА КАУСТИКИ ИЛИ null 
caustics_1_dir_speed:{value:[0,0.0001]}, // [X,Z] НАПРАВЛЕНИЕ И СКОРОСТЬ ПЕРВОЙ КАУСТИКИ
caustics_2_dir_speed:{value:[0,0.0002]}, // [X,Z] НАПРАВЛЕНИЕ И СКОРОСТЬ ВТОРОЙ КАУСТИКИ
caustics_wave:{value:[1,0.1,0.001]}, // ВОЛНА КАУСТИКИ [ЧАСТОТА,МАГНИТУДА,СКОРОСТЬ И НАПАВЛЕНИЕ]
caustics_intensity:{value:2}, // ИНТЕНСИВНОСТЬ
caustics_scale_power:{value:[0.2,1]}, // МАСШТАБ, СИЛА ПРОЯВЛЕНИЯ
caustics_color:{value:new THREE.Color(1.0,1.0,0.4)}, // ЦВЕТ
// ПОД ВОДОЙ
underwater_gradient_offset:1, // НА СКОЛЬКО ОТСТУПИТЬ ГРАДИЕНТУ ОТ ВЕРХА ВОДЫ
underwater_gradient_deep:5, // ГЛУБИНА ГРАДИЕНТА
underwater_top_color_deep:4, // ГЛУБИНА ВЕРХНЕГО ЦВЕТА
underwater_top_color:new THREE.Color(0.0,0.9,0.2), // ВЕРХНИЙ ЦВЕТ
underwater_bottom_color:new THREE.Color(0.0,0.13,0.03), // НИЖНИЙ ЦВЕТ
underwater_sun_flare_color:new THREE.Color(1.0,1.0,0.2), // ЦВЕТ СИЯНИЯ СОЛНЦА
underwater_sun_flare_intensity:0.5, // ИНТЕНСИВНОСТЬ СИЯНИЯ СОЛНЦА
underwater_darkness_deep:20, // ГЛУБИНА ТЕМНОТЫ
underwater_depth_distance:70, // ПРОЗРАЧНОСТЬ ГЛУБИНЫ
gamma:{value:1.0}, // ГАММА
saturation:{value:1.0}, // НАСЫЩЕННОСТЬ
normal_far_smoothing:{value:[250,200]}, // СГЛАЖИВАНИЕ НОРМАЛИ ВДАЛИ [ДИСТАНЦИЯ ОТ,ПРОТЯЖЁННОСТЬ]
sky_far_mix_value:{value:[450,500]}, // СМЕШИВАНИЕ НЕБА С ВОДОЙ ВДАЛИ [ДИСТАНЦИЯ ОТ,ДИСТАНЦИЯ ДО]
// ИСПОЛЬЗОВАТЬ ЛИ ЭТИ ФУНКЦИИ
use_transparent_style:false, // FALSE - ОБЫЧНАЯ ВОДА, TRUE - ПОЛНОСТЬЮ ПРОЗРАЧНАЯ
refraction:2, // 0 - НЕ ИСПОЛЬЗОВАТЬ РЕФРАКЦИЮ, 1 - ИСПОЛЬЗОВАТЬ, НО ПЛОСКУЮ ИЗ 2 ТРЕУГОЛЬНИКОВ, 2 - ИЗ ВСЕХ ТРЕУГОЛЬНИКОВ ВОЛН
use_waves:true, // ВОЛНЫ ГЕРСТНЕРА
use_sss:true, // ПОДПОВЕРХНОСТНОЕ РАССЕИВАНИЕ СВЕТА
use_shore_smoothing:true, // СГЛАЖИВАНИЕ БЕРЕГА  
use_caustics:true, // КАУСТИКА
use_fog:false, // ТУМАН
use_wave_color:true, // ЦВЕТ ВОЛНЫ 
use_foam_waves:true, // ПЕНА НА ВОЛНАХ
use_foam_shore:true, // ПЕНА У БЕРЕГА И ОБЪЕКТОВ 
use_gamma:false, // ГАММА
use_saturation:false, // НАСЫЩЕННОСТЬ
use_back:true, // ОБРАТНАЯ СТОРОНА
use_shadows:true, // ТЕНИ
use_sky_far_mix:true, // СМЕШИВАНИЕ НЕБА С ВОДОЙ ВДАЛИ
use_specular:true, // БЛИКИ СОЛНЦА
use_phong_simple:true, // ИНТЕНСИВНОСТЬ ПРОСТОГО ФОНГА
use_scattering:true, // ИНТЕНСИВНОСТЬ РАССЕИВАНИЯ СВЕТА
use_shore_transparent:true, // ПРОЗРАЧНОСТЬ БЕРЕГА
use_underwater_sun_flare:true, // ПОД ВОДОЙ СИЯНИЕ СОЛНЦА
}


// ____________________ СОЗДАНИЕ МАТЕРИАЛОВ ____________________


for(let i in water){


let water_item=water[i]; 


let material=mat[i]=new THREE.ShaderMaterial({
uniforms:{
position_from_depth_projection:{value:new THREE.Matrix4()},
shadowMap:{value:null},
screen_resolution:{value:null},
screen_texel_size:{value:null},
sun_direction:{value:[0,0,0]},
scene_map:{value:null},
scene_depth_map:{value:null},
water_depth_map:{value:null},
fogDensity:{value:0},
fogColor:{value:[0,0,0]},
fogNear:{value:0},
fogFar:{value:0},
time:{value:0},
},
defines:{
screen_normal_quality:2 // КАЧЕСТВО НОРМАЛИ ИЗ ТЕКСТУРЫ ГЛУБИНЫ: 1 - НИЗКОЕ, 2 - СРЕДНЕЕ, 3 - ВЫСОКОЕ
},
vertexShader:vs["water"],
fragmentShader:fs["water"],
wireframe:water_debug,
side:2
});


if(water_item.use_fog){
if(scene.fog){
if(scene.fog.isFog){
material.fog=true;
material.defines.fog=true;
}
if(scene.fog.isFogExp2){
material.fog=true;
material.defines.fog_exp2=true;
}
}
}


if(water_item.refraction!=0){ material.defines.refraction_use=true; }
if(water_item.refraction==1){ material.defines.refraction_flat=true; }
if(!water_item.use_waves && water_item.refraction==2){ water_item.refraction=1; }
if(water_item.refraction!=0){ water_refaction_enabled=true; }
	

material.defines.use_wave_color=water_item.use_wave_color;
material.defines.use_foam_waves=water_item.use_foam_waves;
material.defines.use_foam_shore=water_item.use_foam_shore;
material.defines.use_gamma=water_item.use_gamma; 
material.defines.use_saturation=water_item.use_saturation;
material.defines.use_sss=water_item.use_sss; 
material.defines.use_caustics=water_item.use_caustics;
material.defines.use_transparent_style=water_item.use_transparent_style;
material.defines.use_back=water_item.use_back;
material.defines.use_sky_far_mix=water_item.use_sky_far_mix;
material.defines.use_shore_smoothing=water_item.use_shore_smoothing;
material.defines.use_specular=water_item.use_specular;
material.defines.use_phong_simple=water_item.use_phong_simple;
material.defines.use_scattering=water_item.use_scattering;
material.defines.use_shore_transparent=water_item.use_shore_transparent;


if(water_item.use_transparent_style){
water_item.underwater_gradient_deep=500;
water_item.underwater_darkness_deep=500;
water_item.underwater_depth_distance=500;
}


if(water_item.holes_map.value){ material.defines.holes=true; }


let u=material.uniforms;


let gerstner_waves_amount=water_item.gerstner_waves.length;


// НОРМАЛИЗУЕМ НАПРАВЛЕНИЕ ВОЛН ГЕРСТНЕРА
for(let n=0;n<gerstner_waves_amount;n++){
let item=water_item.gerstner_waves[n];
let length=1/Math.sqrt(item.x*item.x+item.y*item.y);
item.x*=length;
item.y*=length;
}


// СОЗДАЁМ ВОЛНЫ ГЕРСТНЕРА ДЛЯ РАСЧЁТОВ


water_item.waves=[];


let waves_amplitude=0;
let waves_dx=0;
let waves_dz=0;
let waves_d_max=0;


if(water_item.use_waves){
for(let n=0;n<gerstner_waves_amount;n++){
let item=water_item.gerstner_waves[n];
let k=6.283185307179586/item.w;
let c=Math.sqrt(9.8/k);
let a=item.z/k; // АМПЛИТУДА, МАКСИМАЛЬНАЯ ВЫСОТА
let dx=Math.abs(a*item.x); // МАКСМИАЛЬНОЕ СМЕЩЕНИЯ ПО X
let dz=Math.abs(a*item.y); // МАКСМИАЛЬНОЕ СМЕЩЕНИЯ ПО Z
let d_max=Math.max(dx,dz); // МАКСИМАЛЬНОЕ СМЕЩЕНИЕ В ВИДЕ КВАДРАТА ДЛЯ РАСЧЁТА РАЗМЕРОВ ГЕОМЕТРИИ WATERLINE
waves_amplitude+=a;
waves_dx+=dx;
waves_dz+=dz;
waves_d_max+=d_max;
water_item.waves.push({x:item.x,y:item.y,k:k,c:c,a:a,dx:dx,dz:dz,d_max:d_max});
}
}


water_item.waves_amplitude=waves_amplitude;
water_item.waves_dx=waves_dx;
water_item.waves_dz=waves_dz;
water_item.waves_d_max=waves_d_max;


// ШАГ СЛЕДОВАНИЯ ВОДНОЙ ЛИНИИ ЗА КАМЕРОЙ
if(i!=="ocean"){ water_item.waterline_move=water_item.cells_size[0][0]; }
else{ water_item.waterline_move=water_item.cells_size; }
if(!water_item.use_waves){ water_item.waterline_move=0.1; }


u.gerstner_waves={value:water_item.gerstner_waves};	
material.defines.waves_amount=gerstner_waves_amount;
material.defines.use_waves=water_item.use_waves;


u.gerstner_waves_speed=water_item.gerstner_waves_speed;
u.water_top_color=water_item.water_top_color;		
u.water_bottom_color=water_item.water_bottom_color;
u.wave_color=water_item.wave_color;
u.wave_color_power=water_item.wave_color_power;
u.sss_color=water_item.sss_color;
u.sss_value=water_item.sss_value;
u.shore_smoothing_intensity=water_item.shore_smoothing_intensity;
u.env_mix=water_item.env_mix;
u.env_melt=water_item.env_melt;
u.env_fresnel_min=water_item.env_fresnel_min;
u.env_fresnel_power=water_item.env_fresnel_power;
u.env_intensity=water_item.env_intensity;
u.env_max=water_item.env_max;
u.env_add_background=water_item.env_add_background;
u.envMap=water_item.envMap;
u.foam_shore_map=water_item.foam_shore_map;
u.foam_wave_map=water_item.foam_wave_map;
u.normal_map=water_item.normal_map;
u.caustics_map=water_item.caustics_map;
u.caustics_1_dir_speed=water_item.caustics_1_dir_speed;
u.caustics_2_dir_speed=water_item.caustics_2_dir_speed;
u.caustics_wave=water_item.caustics_wave;
u.caustics_intensity=water_item.caustics_intensity;
u.caustics_scale_power=water_item.caustics_scale_power;
u.caustics_color=water_item.caustics_color;
u.depth_offset=water_item.depth_offset;
u.depth_beers_law=water_item.depth_beers_law;
u.depth_distance=water_item.depth_distance;
u.holes_map=water_item.holes_map;
u.holes_pars=water_item.holes_pars;
if(water_item.use_gamma){ u.gamma=water_item.gamma; }
if(water_item.use_saturation){ u.saturation=water_item.saturation; }
u.foam_waves_value=water_item.foam_waves_value;
u.foam_shore_value=water_item.foam_shore_value;
u.specular=water_item.specular;
u.phong_simple_intensity=water_item.phong_simple_intensity;
u.scattering_intensity=water_item.scattering_intensity;
u.shore_transparent=water_item.shore_transparent;
u.refraction_value=water_item.refraction_value;
u.normal_a_value=water_item.normal_a_value;
u.normal_b_value=water_item.normal_b_value;
u.normal_ab=water_item.normal_ab;
u.normal_c_value=water_item.normal_c_value;
u.normal_d_value=water_item.normal_d_value;
u.normal_cd=water_item.normal_cd;
u.normal_small_far_total=water_item.normal_small_far_total;
u.sun_color={value:[0,0,0]};
u.normal_far_smoothing=water_item.normal_far_smoothing;
u.sky_far_mix_value=water_item.sky_far_mix_value;
u.sun_direction.value=sun_direction;
u.sun_color.value=light["sun"].color;
u.scene_map.value=water_rtt_scene.texture;
u.scene_depth_map.value=water_rtt_scene.depthTexture;
u.water_depth_map.value=water_rtt_refraction.depthTexture;


// ЧТОБЫ ПОЛУЧАТЬ ТЕНИ
if(water_item.use_shadows){
material.lights=true;
material.defines.use_shadows=true;
}
	
	
// ДОБАВЛЯЕМ ПАРАМЕТРЫ ДЛЯ ТЕНЕЙ. ВЗЯТО ИЗ МЕСТА ГДЕ СТОИТ КОД: if ( materialProperties.needsLights ) { 
if(material.lights){
for(let i in THREE.UniformsLib["lights"]){
u[i]={value:null};
}
}


if(i=="ocean"){
u.move={value:[0,0,0]};
material.defines.ocean=true;
}


}


}


// ГЕНЕРАТОР ВОЛН ГЕРСТНЕРА. ПРИМЕР:  gerstner_waves_gen(12,1.1,0,1232.399963,0.02,5); 


function gerstner_waves_gen(amount,multiply_frequency,iteration,add_iteration,steepness,frequency){


let waves=[];
for(let n=0;n<amount;n++){
waves.push(new THREE.Vector4(-Math.sin(iteration),-Math.cos(iteration),steepness,frequency));
frequency*=multiply_frequency;
iteration+=add_iteration;	
}
return waves;


}