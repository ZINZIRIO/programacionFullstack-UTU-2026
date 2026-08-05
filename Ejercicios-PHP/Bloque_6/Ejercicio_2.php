<?php
$precioUnitario = 200;
$cantidadComprada = 6;
$subtotal = $precioUnitario * $cantidadComprada;
$descuento = $cantidadComprada >= 5 ? $subtotal * 0.1 : 0;
$totalFinal = $subtotal - $descuento;

echo "Subtotal: $$subtotal. Descuento: $$descuento. Total final: $$totalFinal.";
