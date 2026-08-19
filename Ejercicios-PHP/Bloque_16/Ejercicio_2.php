<?php
$productos = [
    ["nombre" => "Teclado", "precio" => 1200, "stock" => 5],
    ["nombre" => "Mouse", "precio" => 800, "stock" => 0],
    ["nombre" => "Monitor", "precio" => 6500, "stock" => 3]
];

foreach ($productos as $producto) {
    if ($producto["stock"] > 0) {
        echo "Producto: " . $producto["nombre"] . " - Stock: " . $producto["stock"] . "<br>";
    }
}
