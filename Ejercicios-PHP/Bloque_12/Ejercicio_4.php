<?php
$numeros = [4, 8, 15, 16, 23, 42];
$sumaFor = 0;

for ($i = 0; $i < count($numeros); $i++) {
    $sumaFor += $numeros[$i];
}

$sumaForeach = 0;

foreach ($numeros as $numero) {
    $sumaForeach += $numero;
}

echo "Suma con for: $sumaFor<br>";
echo "Suma con foreach: $sumaForeach";
