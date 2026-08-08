<?php
$notas = [8, 4, 6, 10, 5];

foreach ($notas as $nota) {
    $estado = $nota >= 6 ? "Aprobada" : "Desaprobada";
    echo "Nota $nota: $estado<br>";
}
