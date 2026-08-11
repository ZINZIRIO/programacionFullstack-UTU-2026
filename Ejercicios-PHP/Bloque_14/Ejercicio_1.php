<?php
$numeros = [10, 15, 20, 25, 30];
$suma = 0;

foreach ($numeros as $numero) {
    $suma += $numero;
}

$cantidad = count($numeros);
$promedio = $suma / $cantidad;

echo "Suma total: $suma<br>";
echo "Cantidad de elementos: $cantidad<br>";
echo "Promedio: $promedio";
