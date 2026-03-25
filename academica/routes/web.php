<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/bienvenida', function () {
    return '<h1>Bienvenido a Academica</h1>';
});
Route::get('/saludo/{nombre}', function ($nombre) {
    return "<h1>Bienvenido a la pagina, hola $nombre. como estas....</h1>";
});

