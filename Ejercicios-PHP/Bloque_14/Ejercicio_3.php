<?php
$notas = [8, 4, 6, 10, 5, 7, 3];
$suma = 0;
$aprobados = 0;
$desaprobados = 0;

foreach ($notas as $nota) {
    echo "Nota: $nota<br>";
    $suma += $nota;

    if ($nota >= 6) {
        $aprobados++;
    } else {
        $desaprobados++;
    }
}

$promedio = $suma / count($notas);

echo "Promedio: $promedio<br>";
echo "Aprobados: $aprobados<br>";
echo "Desaprobados: $desaprobados";
