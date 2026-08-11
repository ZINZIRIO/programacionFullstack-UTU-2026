<?php
$resultado = "";

for ($numero = 1; $numero <= 20; $numero++) {
    if ($numero % 2 === 0) {
        $resultado .= $numero . " ";
    }
}

echo trim($resultado);
