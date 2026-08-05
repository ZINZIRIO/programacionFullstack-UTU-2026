<?php
$nombreProducto = "Cuaderno";
$precio = 80;
$stock = 20;
$cantidadSolicitada = 12;

if ($stock >= $cantidadSolicitada) {
    $total = $precio * $cantidadSolicitada;
    $descuento = $cantidadSolicitada >= 10 ? $total * 0.15 : 0;
    $totalFinal = $total - $descuento;
    echo "Producto: $nombreProducto. Total: $$total. Descuento: $$descuento. Total final: $$totalFinal.";
} else {
    echo "Error: no hay stock suficiente";
}
