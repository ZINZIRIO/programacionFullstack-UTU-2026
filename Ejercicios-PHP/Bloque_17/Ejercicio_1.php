<?php
$productos = [
    ["nombre" => "Teclado", "precio" => 1200, "stock" => 5],
    ["nombre" => "Mouse", "precio" => 800, "stock" => 10],
    ["nombre" => "Monitor", "precio" => 6500, "stock" => 3]
];
$nombreBuscado = "Mouse";
$productoEncontrado = null;

foreach ($productos as $producto) {
    if ($producto["nombre"] === $nombreBuscado) {
        $productoEncontrado = $producto;
        break;
    }
}

if ($productoEncontrado !== null) {
    echo "Producto: " . $productoEncontrado["nombre"] . "<br>";
    echo "Precio: $" . $productoEncontrado["precio"] . "<br>";
    echo "Stock: " . $productoEncontrado["stock"];
} else {
    echo "Producto no encontrado.";
}
