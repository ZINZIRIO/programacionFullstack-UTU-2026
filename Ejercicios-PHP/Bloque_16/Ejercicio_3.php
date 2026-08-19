<?php
$productos = [
    ["nombre" => "Teclado", "precio" => 1200, "stock" => 5],
    ["nombre" => "Mouse", "precio" => 800, "stock" => 10],
    ["nombre" => "Monitor", "precio" => 6500, "stock" => 3]
];

foreach ($productos as $producto) {
    if ($producto["precio"] > 1000) {
        echo "Producto: " . $producto["nombre"] . " - Precio: $" . $producto["precio"] . "<br>";
    }
}
