<?php
function obtenerProductosConStock($productos) {
    $productosConStock = [];

    foreach ($productos as $producto) {
        if ($producto["stock"] > 0) {
            $productosConStock[] = $producto;
        }
    }

    return $productosConStock;
}

$productos = [
    ["nombre" => "Teclado", "precio" => 1200, "stock" => 5],
    ["nombre" => "Mouse", "precio" => 800, "stock" => 0],
    ["nombre" => "Monitor", "precio" => 6500, "stock" => 3]
];
$productosConStock = obtenerProductosConStock($productos);

foreach ($productosConStock as $producto) {
    echo $producto["nombre"] . " - Stock: " . $producto["stock"] . "<br>";
}
