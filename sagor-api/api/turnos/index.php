<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$db     = (new Database())->getConnection();
$auth   = requireAuth($db);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $where  = [];
        $params = [];

        if (!empty($_GET['fecha'])) {
            $where[]  = 'fecha = ?';
            $params[] = $_GET['fecha'];
        }
        if (!empty($_GET['tipo_turno'])) {
            $where[]  = 'tipo_turno = ?';
            $params[] = $_GET['tipo_turno'];
        }
        if (!empty($_GET['estado'])) {
            $where[]  = 'estado = ?';
            $params[] = $_GET['estado'];
        }

        $sql  = 'SELECT t.*, u.nombre AS nombre_usuario FROM turnos t LEFT JOIN usuarios u ON t.usuario_id = u.id';
        if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY t.fecha DESC, t.created_at DESC';

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        jsonResponse($stmt->fetchAll());

    case 'POST':
        $body     = getRequestBody();
        $required = ['tipo_turno', 'fecha'];
        foreach ($required as $field) {
            if (empty($body[$field])) jsonResponse(['error' => "Campo requerido: $field"], 400);
        }

        $stmt = $db->prepare(
            'INSERT INTO turnos (usuario_id, nombre_empleado, email, tipo_turno, fecha, estado) VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $auth['id'],
            $body['nombre_empleado'] ?? $auth['nombre'],
            $body['email'] ?? null,
            $body['tipo_turno'],
            $body['fecha'],
            $body['estado'] ?? 'Pendiente',
        ]);
        jsonResponse(['mensaje' => 'Turno registrado', 'id' => $db->lastInsertId()], 201);

    case 'PUT':
        $body = getRequestBody();
        $id   = (int)($body['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requerido'], 400);

        $campos = [];
        $params = [];

        foreach (['nombre_empleado', 'email', 'tipo_turno', 'fecha', 'estado'] as $f) {
            if (isset($body[$f])) {
                $campos[] = "$f = ?";
                $params[] = $body[$f];
            }
        }

        if (empty($campos)) jsonResponse(['error' => 'Nada que actualizar'], 400);

        $params[] = $id;
        $db->prepare('UPDATE turnos SET ' . implode(', ', $campos) . ' WHERE id = ?')->execute($params);
        jsonResponse(['mensaje' => 'Turno actualizado']);

    case 'DELETE':
        if ($auth['rol'] !== 'admin') jsonResponse(['error' => 'Sin permisos'], 403);

        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requerido'], 400);

        $db->prepare('DELETE FROM turnos WHERE id = ?')->execute([$id]);
        jsonResponse(['mensaje' => 'Turno eliminado']);

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
