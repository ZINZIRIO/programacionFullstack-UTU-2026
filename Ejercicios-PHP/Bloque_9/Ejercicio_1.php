<?php
$numero = 1;
$resultado = "";

while ($numero <= 10) {
    $resultado .= $numero . " ";
    $numero++;
}

echo trim($resultado);
