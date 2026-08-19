<?php
$productos = [
    ["nombre" => "Teclado", "precio" => 1200],
    ["nombre" => "Mouse", "precio" => 800],
    ["nombre" => "Monitor", "precio" => 6500]
];
$productoMasCaro = $productos[0];

foreach ($productos as $producto) {
    if ($producto["precio"] > $productoMasCaro["precio"]) {
        $productoMasCaro = $producto;
    }
}

echo "Producto más caro: " . $productoMasCaro["nombre"] . "<br>";
echo "Precio: $" . $productoMasCaro["precio"];
