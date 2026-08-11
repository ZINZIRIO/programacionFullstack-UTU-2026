<?php
$minutosTotales = 135;
$horas = intdiv($minutosTotales, 60);
$minutosRestantes = $minutosTotales % 60;

echo "$minutosTotales minutos equivalen a $horas horas y $minutosRestantes minutos.";
