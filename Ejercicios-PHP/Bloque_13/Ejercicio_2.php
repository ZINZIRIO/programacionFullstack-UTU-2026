<?php
$notas = [8, 4, 6, 10, 5, 7, 3];
$aprobados = 0;

foreach ($notas as $nota) {
    if ($nota >= 6) {
        $aprobados++;
    }
}

echo "Cantidad de aprobados: $aprobados";
