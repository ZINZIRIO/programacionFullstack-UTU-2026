<?php
$productos = [
    ["nombre" => "Teclado", "precio" => 1200, "stock" => 5],
    ["nombre" => "Mouse", "precio" => 800, "stock" => 10],
    ["nombre" => "Monitor", "precio" => 6500, "stock" => 3]
];
$valorTotal = 0;

foreach ($productos as $producto) {
    $valorProducto = $producto["precio"] * $producto["stock"];
    $valorTotal += $valorProducto;
    echo $producto["nombre"] . ": $$valorProducto<br>";
}

echo "Valor total del inventario: $$valorTotal";
