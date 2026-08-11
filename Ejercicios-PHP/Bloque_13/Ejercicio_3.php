<?php
$nombres = ["Ana", "Juan", "María", "Pedro", "Lucía"];
$nombreBuscado = "María";
$encontrado = false;

foreach ($nombres as $nombre) {
    if ($nombre === $nombreBuscado) {
        $encontrado = true;
        break;
    }
}

echo $encontrado ? "El nombre fue encontrado" : "El nombre no existe";
