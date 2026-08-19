<?php
function buscarProductoPorId($productos, $id) {
    foreach ($productos as $producto) {
        if ($producto["id"] === $id) {
            return $producto;
        }
    }

    return null;
}

$productos = [
    ["id" => 1, "nombre" => "Teclado", "precio" => 1200, "stock" => 5],
    ["id" => 2, "nombre" => "Mouse", "precio" => 800, "stock" => 10],
    ["id" => 3, "nombre" => "Monitor", "precio" => 6500, "stock" => 3]
];
$producto = buscarProductoPorId($productos, 2);

if ($producto !== null) {
    echo "Producto: " . $producto["nombre"] . "<br>";
    echo "Precio: $" . $producto["precio"] . "<br>";
    echo "Stock: " . $producto["stock"];
} else {
    echo "Producto no encontrado.";
}
