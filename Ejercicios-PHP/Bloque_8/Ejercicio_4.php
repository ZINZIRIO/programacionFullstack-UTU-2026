<?php
$sumaMultiplos = 0;

for ($numero = 1; $numero <= 100; $numero++) {
    if ($numero % 3 === 0) {
        $sumaMultiplos += $numero;
    }
}

echo $sumaMultiplos;
