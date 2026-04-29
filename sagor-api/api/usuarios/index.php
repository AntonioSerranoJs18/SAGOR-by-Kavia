<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$db      = (new Database())->getConnection();
$auth    = requireAuth($db);
$method  = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $db->query('SELECT id, nombre, email, telefono, turno, rol, fecha_registro FROM usuarios ORDER BY nombre');
        jsonResponse($stmt->fetchAll());

    case 'POST':
        if ($auth['rol'] !== 'admin') jsonResponse(['error' => 'Sin permisos'], 403);

        $body     = getRequestBody();
        $required = ['nombre', 'email', 'password', 'turno', 'rol'];
        foreach ($required as $field) {
            if (empty($body[$field])) jsonResponse(['error' => "Campo requerido: $field"], 400);
        }

        $stmt = $db->prepare('SELECT id FROM usuarios WHERE email = ?');
        $stmt->execute([$body['email']]);
        if ($stmt->fetch()) jsonResponse(['error' => 'El email ya está registrado'], 409);

        $hash = password_hash($body['password'], PASSWORD_DEFAULT);
        $stmt = $db->prepare(
            'INSERT INTO usuarios (nombre, email, telefono, password, turno, rol) VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $body['nombre'],
            $body['email'],
            $body['telefono'] ?? null,
            $hash,
            $body['turno'],
            $body['rol'],
        ]);
        jsonResponse(['mensaje' => 'Usuario creado', 'id' => $db->lastInsertId()], 201);

    case 'PUT':
        if ($auth['rol'] !== 'admin') jsonResponse(['error' => 'Sin permisos'], 403);

        $body = getRequestBody();
        $id   = (int)($body['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requerido'], 400);

        $fields = [];
        $params = [];

        foreach (['nombre', 'email', 'telefono', 'turno', 'rol'] as $f) {
            if (isset($body[$f])) {
                $fields[] = "$f = ?";
                $params[]  = $body[$f];
            }
        }

        if (!empty($body['password'])) {
            $fields[] = 'password = ?';
            $params[]  = password_hash($body['password'], PASSWORD_DEFAULT);
        }

        if (empty($fields)) jsonResponse(['error' => 'Nada que actualizar'], 400);

        $params[] = $id;
        $db->prepare('UPDATE usuarios SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);
        jsonResponse(['mensaje' => 'Usuario actualizado']);

    case 'DELETE':
        if ($auth['rol'] !== 'admin') jsonResponse(['error' => 'Sin permisos'], 403);

        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requerido'], 400);
        if ($id === $auth['id']) jsonResponse(['error' => 'No puedes eliminarte a ti mismo'], 400);

        $db->prepare('DELETE FROM usuarios WHERE id = ?')->execute([$id]);
        jsonResponse(['mensaje' => 'Usuario eliminado']);

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
