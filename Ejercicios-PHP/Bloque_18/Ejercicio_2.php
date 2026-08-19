<?php
function contarAprobados($notas) {
    $aprobados = 0;

    foreach ($notas as $nota) {
        if ($nota >= 6) {
            $aprobados++;
        }
    }

    return $aprobados;
}

$notas = [8, 4, 6, 10, 5, 7, 3];
echo "Cantidad de aprobados: " . contarAprobados($notas);
