<?php
$metodoPago = "transferencia";

switch ($metodoPago) {
    case "efectivo":
        $descuento = "10% de descuento";
        break;
    case "tarjeta":
        $descuento = "precio normal";
        break;
    case "transferencia":
        $descuento = "5% de descuento";
        break;
    default:
        $descuento = "método de pago inválido";
}

echo "Método de pago: $metodoPago. Descuento: $descuento.";
