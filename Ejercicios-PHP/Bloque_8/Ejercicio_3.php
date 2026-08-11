<?php
$cantidadPares = 0;

for ($numero = 1; $numero <= 50; $numero++) {
    if ($numero % 2 === 0) {
        $cantidadPares++;
    }
}

echo $cantidadPares;
