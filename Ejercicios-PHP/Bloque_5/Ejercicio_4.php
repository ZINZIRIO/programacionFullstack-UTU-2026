<?php
$edad = 16;
$tieneEntrada = true;
$acompanadoPorAdulto = true;

if (($edad >= 18 && $tieneEntrada) || ($edad < 18 && $acompanadoPorAdulto)) {
    echo "Puede entrar";
} else {
    echo "No puede entrar";
}
