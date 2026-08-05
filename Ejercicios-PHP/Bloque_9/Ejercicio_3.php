<?php
$numero = 1;
$resultado = "";

while ($numero < 100) {
    $resultado .= $numero . " ";
    $numero *= 2;
}

echo trim($resultado);
