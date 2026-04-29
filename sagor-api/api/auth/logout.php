<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Método no permitido'], 405);
}

$db   = (new Database())->getConnection();
$auth = requireAuth($db);

$db->prepare('UPDATE usuarios SET token = NULL WHERE id = ?')->execute([$auth['id']]);

jsonResponse(['mensaje' => 'Sesión cerrada']);
