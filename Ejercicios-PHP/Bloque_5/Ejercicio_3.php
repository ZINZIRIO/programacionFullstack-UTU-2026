<?php
$precio = 150;
$presupuesto = 1000;
$stock = 10;
$cantidadSolicitada = 5;
$costoTotal = $precio * $cantidadSolicitada;

if ($stock >= $cantidadSolicitada && $presupuesto >= $costoTotal) {
    echo "Compra realizada correctamente";
} else {
    echo "No se puede realizar la compra";
}
