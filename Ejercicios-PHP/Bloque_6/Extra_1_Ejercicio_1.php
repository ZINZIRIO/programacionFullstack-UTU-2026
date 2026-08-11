<?php
$tipoCliente = 2;

switch ($tipoCliente) {
    case 1:
        echo "Cliente común: sin descuento";
        break;
    case 2:
        echo "Cliente frecuente: 10% de descuento";
        break;
    case 3:
        echo "Cliente premium: 20% de descuento";
        break;
    default:
        echo "Error";
}
