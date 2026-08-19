<?php
$producto = [
    "nombre" => "Mouse",
    "precio" => 800,
    "stock" => 12
];

echo "Producto original: " . $producto["nombre"] . " - $" . $producto["precio"] . " - Stock: " . $producto["stock"] . "<br>";

$producto["precio"] += 200;
$producto["stock"] -= 3;
$producto["categoria"] = "Accesorios";

echo "Producto actualizado: " . $producto["nombre"] . "<br>";
echo "Precio: $" . $producto["precio"] . "<br>";
echo "Stock: " . $producto["stock"] . "<br>";
echo "Categoría: " . $producto["categoria"];
