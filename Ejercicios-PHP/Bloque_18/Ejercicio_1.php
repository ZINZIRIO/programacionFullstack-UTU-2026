<?php
function sumarNumeros($numeros) {
    $suma = 0;

    foreach ($numeros as $numero) {
        $suma += $numero;
    }

    return $suma;
}

$numeros = [4, 8, 15, 16, 23, 42];
echo "Suma: " . sumarNumeros($numeros);
