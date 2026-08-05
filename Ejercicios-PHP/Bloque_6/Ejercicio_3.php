<?php
$totalCompra = 6000;

if ($totalCompra >= 5000) {
    $descuento = $totalCompra * 0.2;
} elseif ($totalCompra >= 1000) {
    $descuento = $totalCompra * 0.1;
} else {
    $descuento = 0;
}

$totalFinal = $totalCompra - $descuento;

echo "Total original: $$totalCompra. Descuento: $$descuento. Total final: $$totalFinal.";
