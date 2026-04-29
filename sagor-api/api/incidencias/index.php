<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$db     = (new Database())->getConnection();
$auth   = requireAuth($db);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $id = (int)($_GET['id'] ?? 0);

        if ($id) {
            $stmt = $db->prepare(
                'SELECT i.*, u.nombre AS nombre_usuario
                 FROM incidencias i
                 LEFT JOIN usuarios u ON i.usuario_id = u.id
                 WHERE i.id = ?'
            );
            $stmt->execute([$id]);
            $inc = $stmt->fetch();
            if (!$inc) jsonResponse(['error' => 'Incidencia no encontrada'], 404);
            jsonResponse($inc);
        }

        $where  = [];
        $params = [];

        if (!empty($_GET['fecha_inicio'])) {
            $where[]  = 'i.fecha >= ?';
            $params[] = $_GET['fecha_inicio'];
        }
        if (!empty($_GET['fecha_fin'])) {
            $where[]  = 'i.fecha <= ?';
            $params[] = $_GET['fecha_fin'];
        }
        if (!empty($_GET['tipo'])) {
            $where[]  = 'i.tipo = ?';
            $params[] = $_GET['tipo'];
        }
        if (!empty($_GET['estado'])) {
            $where[]  = 'i.estado = ?';
            $params[] = $_GET['estado'];
        }
        if (!empty($_GET['prioridad'])) {
            $where[]  = 'i.prioridad = ?';
            $params[] = $_GET['prioridad'];
        }

        $sql = 'SELECT i.*, u.nombre AS nombre_usuario
                FROM incidencias i
                LEFT JOIN usuarios u ON i.usuario_id = u.id';
        if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY i.fecha DESC, i.created_at DESC';

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        jsonResponse($stmt->fetchAll());

    case 'POST':
        $body     = getRequestBody();
        $required = ['tipo', 'descripcion', 'fecha'];
        foreach ($required as $field) {
            if (empty($body[$field])) jsonResponse(['error' => "Campo requerido: $field"], 400);
        }

        $stmt = $db->prepare(
            'INSERT INTO incidencias (usuario_id, turno_id, tipo, prioridad, descripcion, estado, fecha)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $auth['id'],
            $body['turno_id']   ?? null,
            $body['tipo'],
            $body['prioridad']  ?? 'Media',
            $body['descripcion'],
            $body['estado']     ?? 'Abierta',
            $body['fecha'],
        ]);
        jsonResponse(['mensaje' => 'Incidencia registrada', 'id' => $db->lastInsertId()], 201);

    case 'PUT':
        $body = getRequestBody();
        $id   = (int)($body['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requerido'], 400);

        $campos = [];
        $params = [];

        foreach (['tipo', 'prioridad', 'descripcion', 'estado', 'fecha', 'turno_id'] as $f) {
            if (isset($body[$f])) {
                $campos[] = "$f = ?";
                $params[] = $body[$f];
            }
        }

        if (empty($campos)) jsonResponse(['error' => 'Nada que actualizar'], 400);

        $params[] = $id;
        $db->prepare('UPDATE incidencias SET ' . implode(', ', $campos) . ' WHERE id = ?')->execute($params);
        jsonResponse(['mensaje' => 'Incidencia actualizada']);

    case 'DELETE':
        if ($auth['rol'] !== 'admin') jsonResponse(['error' => 'Sin permisos'], 403);

        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requerido'], 400);

        $db->prepare('DELETE FROM incidencias WHERE id = ?')->execute([$id]);
        jsonResponse(['mensaje' => 'Incidencia eliminada']);

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
