<?php
$stockDisponible = 15;
$cantidadSolicitada = 8;
$precio = 120;
$presupuestoCliente = 1000;
$costoTotal = $cantidadSolicitada * $precio;

echo "Stock suficiente: " . ($stockDisponible >= $cantidadSolicitada ? "Sí" : "No") . ". Presupuesto suficiente: " . ($presupuestoCliente >= $costoTotal ? "Sí" : "No") . ".";
