let camera_position=new THREE.Vector3();
let camera_direction=new THREE.Vector3();
let camera_position_x=0;
let camera_position_y=0;
let camera_position_z=0;
let camera_direction_x=0;
let camera_direction_y=0;
let camera_direction_z=0;
let camera_2d_direction_x=0;
let camera_2d_direction_z=0;
let camera_lengthSq=0;
let camera_angle_z=0;
let camera_angle_y=0


function camera_data_update(){


// ЗДЕСЬ МАТРИЦА ОБНОВЛЯЕТСЯ САМА ВНУТРИ ФУНКЦИИ
camera.getWorldPosition(camera_position);
camera.getWorldDirection(camera_direction);


camera_position_x=camera_position.x;
camera_position_y=camera_position.y;
camera_position_z=camera_position.z;
camera_direction_x=camera_direction.x;
camera_direction_y=camera_direction.y;
camera_direction_z=camera_direction.z;


camera_angle_z=90-Math.asin(camera_direction_y)*radian_to_degrees;
camera_angle_y=180+Math.atan2(camera_direction_x,camera_direction_z)*radian_to_degrees;  


camera_lengthSq=camera_direction_x*camera_direction_x+camera_direction_y*camera_direction_y+camera_direction_z*camera_direction_z;


// ВЕКТОР КАМЕРЫ ДЛЯ 2D СЛУЧАЯ
camera_2d_direction_x=camera_direction_x/Math.abs(camera_direction_y);
camera_2d_direction_z=camera_direction_z/Math.abs(camera_direction_y);


let divider=1/Math.sqrt(camera_2d_direction_x*camera_2d_direction_x+camera_2d_direction_z*camera_2d_direction_z);
camera_2d_direction_x*=divider;
camera_2d_direction_z*=divider;


}