<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Método no permitido'], 405);
}

$body = getRequestBody();
$email    = trim($body['email'] ?? '');
$password = trim($body['password'] ?? '');

if (empty($email) || empty($password)) {
    jsonResponse(['error' => 'Email y contraseña son requeridos'], 400);
}

$db   = (new Database())->getConnection();
$stmt = $db->prepare('SELECT id, nombre, email, telefono, turno, rol, password FROM usuarios WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    jsonResponse(['error' => 'Credenciales incorrectas'], 401);
}

$token = bin2hex(random_bytes(32));
$db->prepare('UPDATE usuarios SET token = ? WHERE id = ?')->execute([$token, $user['id']]);

unset($user['password']);
$user['token'] = $token;

jsonResponse(['mensaje' => 'Login exitoso', 'usuario' => $user]);
