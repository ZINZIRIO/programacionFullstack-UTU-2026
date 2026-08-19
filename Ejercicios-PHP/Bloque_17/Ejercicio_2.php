<?php
$productos = [
    ["id" => 1, "nombre" => "Teclado", "precio" => 1200, "stock" => 5],
    ["id" => 2, "nombre" => "Mouse", "precio" => 800, "stock" => 10],
    ["id" => 3, "nombre" => "Monitor", "precio" => 6500, "stock" => 3]
];
$idBuscado = 3;
$productoEncontrado = null;

foreach ($productos as $producto) {
    if ($producto["id"] === $idBuscado) {
        $productoEncontrado = $producto;
        break;
    }
}

if ($productoEncontrado !== null) {
    echo "ID: " . $productoEncontrado["id"] . "<br>";
    echo "Nombre: " . $productoEncontrado["nombre"] . "<br>";
    echo "Precio: $" . $productoEncontrado["precio"] . "<br>";
    echo "Stock: " . $productoEncontrado["stock"];
}
