<?php
$productos = [
    ["id" => 1, "nombre" => "Teclado", "precio" => 1200, "stock" => 5],
    ["id" => 2, "nombre" => "Mouse", "precio" => 800, "stock" => 10],
    ["id" => 3, "nombre" => "Monitor", "precio" => 6500, "stock" => 3]
];
$idBuscado = 4;
$encontrado = false;

foreach ($productos as $producto) {
    if ($producto["id"] === $idBuscado) {
        echo "ID: " . $producto["id"] . "<br>";
        echo "Nombre: " . $producto["nombre"] . "<br>";
        echo "Precio: $" . $producto["precio"] . "<br>";
        echo "Stock: " . $producto["stock"];
        $encontrado = true;
        break;
    }
}

if (!$encontrado) {
    echo "Producto no encontrado";
}
