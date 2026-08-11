<?php
$numero = 2;
$resultado = "";

while ($numero <= 20) {
    $resultado .= $numero . " ";
    $numero += 2;
}

echo trim($resultado);
