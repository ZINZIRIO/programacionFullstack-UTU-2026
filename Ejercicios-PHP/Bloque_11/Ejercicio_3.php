<?php
function aplicarDescuento($precio, $porcentaje) {
    return $precio - ($precio * $porcentaje / 100);
}

$precioFinal = aplicarDescuento(1000, 10);
echo $precioFinal;
