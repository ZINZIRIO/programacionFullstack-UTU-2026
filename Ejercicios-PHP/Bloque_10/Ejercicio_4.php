<?php
function calcularTotal($precio, $cantidad) {
    return $precio * $cantidad;
}

echo calcularTotal(1200, 2) . "<br>";
echo calcularTotal(350, 5);
