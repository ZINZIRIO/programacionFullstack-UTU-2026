<?php
function mostrarProductos($productos) {
    foreach ($productos as $producto) {
        echo "ID: " . $producto["id"] . " - " . $producto["nombre"] . " - $" . $producto["precio"] . " - Stock: " . $producto["stock"] . " - Categoría: " . $producto["categoria"] . "<br>";
    }
}

function mostrarProductosConStock($productos) {
    foreach ($productos as $producto) {
        if ($producto["stock"] > 0) {
            echo $producto["nombre"] . " - Stock: " . $producto["stock"] . "<br>";
        }
    }
}

function buscarProductoPorId($productos, $id) {
    foreach ($productos as $producto) {
        if ($producto["id"] === $id) {
            return $producto;
        }
    }

    return null;
}

function calcularValorInventario($productos) {
    $total = 0;

    foreach ($productos as $producto) {
        $total += $producto["precio"] * $producto["stock"];
    }

    return $total;
}

function obtenerProductoMasCaro($productos) {
    $masCaro = $productos[0];

    foreach ($productos as $producto) {
        if ($producto["precio"] > $masCaro["precio"]) {
            $masCaro = $producto;
        }
    }

    return $masCaro;
}

$productos = [
    ["id" => 1, "nombre" => "Teclado", "precio" => 1200, "stock" => 5, "categoria" => "Periféricos"],
    ["id" => 2, "nombre" => "Mouse", "precio" => 800, "stock" => 0, "categoria" => "Periféricos"],
    ["id" => 3, "nombre" => "Monitor", "precio" => 6500, "stock" => 3, "categoria" => "Pantallas"]
];

echo "Todos los productos:<br>";
mostrarProductos($productos);
echo "Productos con stock:<br>";
mostrarProductosConStock($productos);

$productoBuscado = buscarProductoPorId($productos, 3);
if ($productoBuscado !== null) {
    echo "Producto buscado: " . $productoBuscado["nombre"] . "<br>";
}

echo "Valor total del inventario: $" . calcularValorInventario($productos) . "<br>";
$productoMasCaro = obtenerProductoMasCaro($productos);
echo "Producto más caro: " . $productoMasCaro["nombre"] . " - $" . $productoMasCaro["precio"];
