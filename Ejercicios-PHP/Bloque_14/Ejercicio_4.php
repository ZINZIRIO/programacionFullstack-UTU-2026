<?php
$numeros = [12, 7, 20, 5, 18, 9, 24];
$suma = 0;
$mayor = $numeros[0];
$menor = $numeros[0];
$pares = 0;
$impares = 0;

foreach ($numeros as $numero) {
    echo "Número: $numero<br>";
    $suma += $numero;

    if ($numero > $mayor) {
        $mayor = $numero;
    }

    if ($numero < $menor) {
        $menor = $numero;
    }

    if ($numero % 2 === 0) {
        $pares++;
    } else {
        $impares++;
    }
}

$promedio = $suma / count($numeros);

echo "Suma: $suma<br>";
echo "Promedio: $promedio<br>";
echo "Mayor: $mayor<br>";
echo "Menor: $menor<br>";
echo "Pares: $pares<br>";
echo "Impares: $impares";
