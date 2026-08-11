<?php
function calcularPromedio($nota1, $nota2, $nota3) {
    return ($nota1 + $nota2 + $nota3) / 3;
}

function indicarResultado($promedio) {
    return $promedio >= 6 ? "Aprobado" : "Desaprobado";
}

$promedio = calcularPromedio(8, 7, 5);
echo "Promedio: $promedio<br>";
echo indicarResultado($promedio);
