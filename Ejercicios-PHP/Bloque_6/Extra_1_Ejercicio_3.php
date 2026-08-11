<?php
$numero1 = 20;
$numero2 = 4;
$opcion = 4;

switch ($opcion) {
    case 1:
        echo $numero1 + $numero2;
        break;
    case 2:
        echo $numero1 - $numero2;
        break;
    case 3:
        echo $numero1 * $numero2;
        break;
    case 4:
        echo $numero2 !== 0 ? $numero1 / $numero2 : "Error";
        break;
    default:
        echo "Opción incorrecta";
}
