<?php
/**
 * setup.php — Datos iniciales de SAGOR
 * Ejecutar UNA sola vez desde XAMPP: http://localhost/sagor-api/setup.php
 */
require_once __DIR__ . '/config/database.php';

$db = (new Database())->getConnection();

$usuarios = [
    [
        'nombre'   => 'Cristian Serrano',
        'email'    => 'cristian@hotelchariot.com',
        'telefono' => '9991234567',
        'turno'    => 'Matutino',
        'rol'      => 'cajero',
    ],
    [
        'nombre'   => 'Evelyn Noh',
        'email'    => 'evelyn@hotelchariot.com',
        'telefono' => '9997654321',
        'turno'    => 'Vespertino',
        'rol'      => 'cajero',
    ],
    [
        'nombre'   => 'Javier Acosta',
        'email'    => 'javier@hotelchariot.com',
        'telefono' => '9998887766',
        'turno'    => 'Nocturno',
        'rol'      => 'cajero',
    ],
    [
        'nombre'   => 'Administrador',
        'email'    => 'admin@hotelchariot.com',
        'telefono' => null,
        'turno'    => 'Administrador',
        'rol'      => 'admin',
    ],
];

$stmt = $db->prepare(
    'INSERT IGNORE INTO usuarios (nombre, email, telefono, password, turno, rol) VALUES (?, ?, ?, ?, ?, ?)'
);

$hash = password_hash('sagor2026', PASSWORD_DEFAULT);

foreach ($usuarios as $u) {
    $stmt->execute([$u['nombre'], $u['email'], $u['telefono'], $hash, $u['turno'], $u['rol']]);
}

echo '<pre>';
echo "✅ Setup completado.\n\n";
echo "Usuarios creados (contraseña: sagor2026):\n";
foreach ($usuarios as $u) {
    echo "  • {$u['nombre']} — {$u['email']} — {$u['rol']}\n";
}
echo "\nEndpoints disponibles:\n";
echo "  POST   http://localhost/sagor-api/api/auth/login.php\n";
echo "  GET    http://localhost/sagor-api/api/usuarios/index.php\n";
echo "  GET    http://localhost/sagor-api/api/turnos/index.php\n";
echo "  GET    http://localhost/sagor-api/api/cortes/index.php\n";
echo "  GET    http://localhost/sagor-api/api/reportes/index.php\n";
echo '</pre>';
