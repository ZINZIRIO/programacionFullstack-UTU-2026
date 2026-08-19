<?php
$producto = [
    "nombre" => "Auriculares",
    "precio" => 1500,
    "stock" => 8
];
$cantidadSolicitada = 3;

if ($producto["stock"] >= $cantidadSolicitada) {
    $total = $producto["precio"] * $cantidadSolicitada;
    $producto["stock"] -= $cantidadSolicitada;

    echo "Venta realizada: " . $producto["nombre"] . "<br>";
    echo "Cantidad: $cantidadSolicitada<br>";
    echo "Total: $$total<br>";
    echo "Stock restante: " . $producto["stock"];
} else {
    echo "No hay stock suficiente.";
}
