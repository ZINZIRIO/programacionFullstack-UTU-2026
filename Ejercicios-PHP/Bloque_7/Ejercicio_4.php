<?php
$numero = 5;
$resultado = "";

for ($multiplicador = 1; $multiplicador <= 10; $multiplicador++) {
    $resultado .= "$numero x $multiplicador = " . ($numero * $multiplicador) . ". ";
}

echo trim($resultado);
