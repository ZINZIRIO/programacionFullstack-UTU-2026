<?php
$productos = [
    ["nombre" => "Teclado", "precio" => 1200],
    ["nombre" => "Mouse", "precio" => 800],
    ["nombre" => "Monitor", "precio" => 6500]
];

foreach ($productos as $producto) {
    echo "Producto: " . $producto["nombre"] . " - Precio: $" . $producto["precio"] . "<br>";
}
