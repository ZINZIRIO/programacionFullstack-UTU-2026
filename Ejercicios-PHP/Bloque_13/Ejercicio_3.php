<?php
$nombres=["Juan", "María", "Pedro", "Ana", "Luis", "Valentina"];
$nombre ="Juan";
$encontrado = false;

foreach($nombres as $nombre)    {
    if($nombre == "Juan") {
        $encontrado = true;
        break;
    }
}

if($encontrado) {
    echo "El nombre $nombre fue encontrado.";
} else {
    echo "El nombre $nombre no fue encontrado.";
}   

    ?>