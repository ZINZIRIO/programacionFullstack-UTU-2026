<?php
function calcularPromedio($notas) {
    $suma = 0;

    foreach ($notas as $nota) {
        $suma += $nota;
    }

    return $suma / count($notas);
}

function obtenerNotaMayor($notas) {
    $mayor = $notas[0];

    foreach ($notas as $nota) {
        if ($nota > $mayor) {
            $mayor = $nota;
        }
    }

    return $mayor;
}

function obtenerNotaMenor($notas) {
    $menor = $notas[0];

    foreach ($notas as $nota) {
        if ($nota < $menor) {
            $menor = $nota;
        }
    }

    return $menor;
}

function contarNotas($notas, $aprobadas) {
    $cantidad = 0;

    foreach ($notas as $nota) {
        if (($aprobadas && $nota >= 6) || (!$aprobadas && $nota < 6)) {
            $cantidad++;
        }
    }

    return $cantidad;
}

$notas = [8, 4, 6, 10, 5, 7, 3];

foreach ($notas as $nota) {
    echo "Nota: $nota<br>";
}

echo "Promedio: " . calcularPromedio($notas) . "<br>";
echo "Nota más alta: " . obtenerNotaMayor($notas) . "<br>";
echo "Nota más baja: " . obtenerNotaMenor($notas) . "<br>";
echo "Aprobados: " . contarNotas($notas, true) . "<br>";
echo "Desaprobados: " . contarNotas($notas, false);
