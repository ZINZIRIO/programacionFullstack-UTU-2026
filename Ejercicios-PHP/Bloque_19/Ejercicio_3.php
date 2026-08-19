<?php
function buscarUsuarioPorNombre($usuarios, $nombreUsuario) {
    foreach ($usuarios as $usuario) {
        if ($usuario["usuario"] === $nombreUsuario) {
            return $usuario;
        }
    }

    return null;
}

$usuarios = [
    ["id" => 1, "nombre" => "Ana Pérez", "usuario" => "ana", "contrasena" => "ana123", "rol" => "administrador", "activo" => true],
    ["id" => 2, "nombre" => "Luis Gómez", "usuario" => "luis", "contrasena" => "luis123", "rol" => "docente", "activo" => true],
    ["id" => 3, "nombre" => "Sofía Rodríguez", "usuario" => "sofia", "contrasena" => "sofia123", "rol" => "estudiante", "activo" => false]
];
$nombreUsuario = "ana";
$contrasena = "ana123";
$usuario = buscarUsuarioPorNombre($usuarios, $nombreUsuario);

if ($usuario === null) {
    echo "Usuario o contraseña incorrectos.";
} elseif ($usuario["contrasena"] !== $contrasena) {
    echo "Usuario o contraseña incorrectos.";
} elseif (!$usuario["activo"]) {
    echo "El usuario está inactivo.";
} else {
    if ($usuario["rol"] === "administrador") {
        echo "Bienvenido administrador " . $usuario["nombre"] . ".";
    } elseif ($usuario["rol"] === "docente") {
        echo "Bienvenido docente " . $usuario["nombre"] . ".";
    } else {
        echo "Bienvenido estudiante " . $usuario["nombre"] . ".";
    }
}
