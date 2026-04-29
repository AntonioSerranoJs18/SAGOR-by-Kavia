<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function jsonResponse(mixed $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

function getRequestBody(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function requireAuth(PDO $db): array {
    // Apache/XAMPP a veces elimina el header Authorization — se revisan múltiples fuentes
    $headers = getallheaders();
    $token   = $headers['Authorization']
            ?? $headers['authorization']
            ?? $_SERVER['HTTP_AUTHORIZATION']
            ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
            ?? '';
    $token = str_replace('Bearer ', '', $token);

    if (empty($token)) {
        jsonResponse(['error' => 'Token requerido'], 401);
    }

    $stmt = $db->prepare('SELECT id, nombre, rol FROM usuarios WHERE token = ? AND token IS NOT NULL');
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonResponse(['error' => 'Token inválido o expirado'], 401);
    }

    return $user;
}
