<?php
/*
Plugin Name: WU-App
Plugin URI: https://github.com/bawangxx/WU-App
Description: 无忧App，让开发更简单
Version: 1.0
Author: bawangxx
Author URI: https://github.com/bawangxx/WU-App
*/

include_once ('TuwenLesson.php');
include_once ('VideoLesson.php');

add_action( 'rest_api_init', 'prefix_register_my_rest_routes' );//路由

//注册路由
function prefix_register_my_rest_routes() {
    $controller = new TuwenLesson_Controller();
    $controller->register_routes();
}
