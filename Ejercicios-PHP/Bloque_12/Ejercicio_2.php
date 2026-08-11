<?php
$nombres = ["Ana", "Juan", "María", "Pedro", "Lucía"];

for ($i = 0; $i < count($nombres); $i++) {
    echo $nombres[$i] . "<br>";
}

foreach ($nombres as $nombre) {
    echo $nombre . "<br>";
}
