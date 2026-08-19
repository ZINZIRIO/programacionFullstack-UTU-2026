<?php
function calcularSubtotal($producto) {
    return $producto["precio"] * $producto["cantidad"];
}

function calcularTotal($productos) {
    $total = 0;

    foreach ($productos as $producto) {
        $total += calcularSubtotal($producto);
    }

    return $total;
}

function aplicarDescuento($total) {
    if ($total > 5000) {
        return $total * 0.9;
    }

    return $total;
}

$productos = [
    ["nombre" => "Teclado", "precio" => 1200, "cantidad" => 2],
    ["nombre" => "Mouse", "precio" => 800, "cantidad" => 1],
    ["nombre" => "Auriculares", "precio" => 1500, "cantidad" => 2]
];

foreach ($productos as $producto) {
    $subtotal = calcularSubtotal($producto);
    echo $producto["nombre"] . " - Precio: $" . $producto["precio"] . " - Cantidad: " . $producto["cantidad"] . " - Subtotal: $$subtotal<br>";
}

$total = calcularTotal($productos);
$totalFinal = aplicarDescuento($total);

echo "Total: $$total<br>";
if ($totalFinal < $total) {
    echo "Descuento aplicado: 10%<br>";
}
echo "Total final: $$totalFinal";
