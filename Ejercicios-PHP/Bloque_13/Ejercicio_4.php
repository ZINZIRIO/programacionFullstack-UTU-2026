<?php
$numeros = [12, 45, 7, 89, 32, 61];
$mayor = $numeros[0];

foreach($numeros as $numero) {
    if ($numero > $mayor) {
        $mayor = $numero;
    }
}
echo "El número mayor es: $mayor";