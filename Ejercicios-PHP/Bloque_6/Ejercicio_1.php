<?php
$edad = 10;
$precioEntrada = 500;
$descuento = $edad < 12 ? $precioEntrada * 0.5 : 0;
$precioFinal = $precioEntrada - $descuento;

echo "Precio final: $$precioFinal";
