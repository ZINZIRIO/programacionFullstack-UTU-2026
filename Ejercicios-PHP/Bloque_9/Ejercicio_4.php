<?php
$ahorro = 0;
$meses = 0;

while ($ahorro < 5000) {
    $meses++;
    $ahorro += 500;
    echo "Mes $meses: $$ahorro. ";
}
