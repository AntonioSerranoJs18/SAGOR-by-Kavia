<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$db     = (new Database())->getConnection();
$auth   = requireAuth($db);
$method = $_SERVER['REQUEST_METHOD'];

function turnoDesdeHora(): string {
    $h = (int)date('H');
    if ($h >= 6  && $h < 14) return 'Matutino';
    if ($h >= 14 && $h < 22) return 'Vespertino';
    return 'Nocturno';
}

switch ($method) {

    case 'GET':
        /* ── Estado para el dashboard del recepcionista ── */
        if (!empty($_GET['estado_inicio'])) {
            $tipo  = turnoDesdeHora();
            $fecha = date('Y-m-d');

            // Turno activo propio
            $stmt = $db->prepare("SELECT * FROM turnos WHERE usuario_id = ? AND estado = 'Activo' LIMIT 1");
            $stmt->execute([$auth['id']]);
            $propio = $stmt->fetch() ?: null;

            // Cualquier turno activo en el sistema
            $stmt = $db->prepare("SELECT * FROM turnos WHERE estado = 'Activo' LIMIT 1");
            $stmt->execute();
            $sistema = $stmt->fetch() ?: null;

            if ($propio) {
                // ¿Ya registró el corte para este turno?
                $stmt = $db->prepare(
                    "SELECT id FROM cortes
                     WHERE usuario_id = ? AND turno = ?
                     AND (fecha = ? OR fecha = DATE_ADD(?, INTERVAL 1 DAY))"
                );
                $stmt->execute([$auth['id'], $propio['tipo_turno'], $propio['fecha'], $propio['fecha']]);
                $propio['tiene_corte'] = (bool)$stmt->fetch();
            }

            jsonResponse([
                'turno_activo_propio'  => $propio,
                'turno_activo_sistema' => $sistema,
                'puede_iniciar'        => !$sistema,
                'motivo'               => $sistema
                    ? "El turno de {$sistema['nombre_empleado']} ({$sistema['tipo_turno']}) aún está activo."
                    : null,
                'turno_sugerido' => $tipo,
                'fecha_sugerida' => $fecha,
            ]);
        }

        /* ── Lista normal ── */
        $where  = [];
        $params = [];

        if (!empty($_GET['fecha']))       { $where[] = 't.fecha = ?';       $params[] = $_GET['fecha']; }
        if (!empty($_GET['fecha_inicio'])){ $where[] = 't.fecha >= ?';      $params[] = $_GET['fecha_inicio']; }
        if (!empty($_GET['tipo_turno'])) { $where[] = 't.tipo_turno = ?';  $params[] = $_GET['tipo_turno']; }
        if (!empty($_GET['estado']))      { $where[] = 't.estado = ?';      $params[] = $_GET['estado']; }
        if (!empty($_GET['usuario_id'])) { $where[] = 't.usuario_id = ?';  $params[] = $_GET['usuario_id']; }

        $sql = 'SELECT t.*, u.nombre AS nombre_usuario
                FROM turnos t LEFT JOIN usuarios u ON t.usuario_id = u.id';
        if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY t.fecha DESC, t.created_at DESC';

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        jsonResponse($stmt->fetchAll());

    case 'POST':
        $body = getRequestBody();

        $tipo_turno = $body['tipo_turno'] ?? turnoDesdeHora();
        $fecha      = $body['fecha']      ?? date('Y-m-d');

        /* ── Solo cajeros pueden iniciar turnos ── */
        if ($auth['rol'] === 'admin') {
            jsonResponse(['error' => 'Los turnos los inician los cajeros.'], 403);
        }

        // 1. Usuario ya tiene turno activo
        $stmt = $db->prepare("SELECT id FROM turnos WHERE usuario_id = ? AND estado = 'Activo'");
        $stmt->execute([$auth['id']]);
        if ($stmt->fetch()) jsonResponse(['error' => 'Ya tienes un turno activo.'], 409);

        // 2. Otro usuario tiene turno activo
        $stmt = $db->prepare("SELECT id, nombre_empleado, tipo_turno FROM turnos WHERE estado = 'Activo'");
        $stmt->execute();
        $activo = $stmt->fetch();
        if ($activo) {
            jsonResponse([
                'error' => "El turno de {$activo['nombre_empleado']} ({$activo['tipo_turno']}) aún está activo. Espera a que finalice."
            ], 409);
        }

        // 3. Turno anterior debe estar finalizado
        $orden    = ['Matutino', 'Vespertino', 'Nocturno'];
        $idx      = array_search($tipo_turno, $orden);
        $prevTipo = $orden[($idx + 2) % 3];
        $prevFecha = ($idx === 0)
            ? date('Y-m-d', strtotime($fecha . ' -1 day'))
            : $fecha;

        $stmt = $db->prepare(
            "SELECT estado, nombre_empleado FROM turnos
             WHERE tipo_turno = ? AND fecha = ? ORDER BY created_at DESC LIMIT 1"
        );
        $stmt->execute([$prevTipo, $prevFecha]);
        $prev = $stmt->fetch();

        if ($prev && $prev['estado'] !== 'Finalizado') {
            jsonResponse([
                'error' => "El turno anterior ({$prev['nombre_empleado']} - {$prevTipo}) aún no ha finalizado su turno."
            ], 409);
        }

        $stmt = $db->prepare(
            'INSERT INTO turnos (usuario_id, nombre_empleado, email, tipo_turno, fecha, estado)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$auth['id'], $auth['nombre'], null, $tipo_turno, $fecha, 'Activo']);
        jsonResponse(['mensaje' => 'Turno iniciado', 'id' => $db->lastInsertId()], 201);

    case 'PUT':
        $id   = (int)($_GET['id'] ?? 0);
        $body = getRequestBody();
        if (!$id) $id = (int)($body['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requerido'], 400);

        /* ── Finalizar turno ── */
        if (($body['estado'] ?? '') === 'Finalizado') {
            $stmt = $db->prepare('SELECT * FROM turnos WHERE id = ?');
            $stmt->execute([$id]);
            $turno = $stmt->fetch();
            if (!$turno) jsonResponse(['error' => 'Turno no encontrado'], 404);

            if ((int)$turno['usuario_id'] !== (int)$auth['id'] && $auth['rol'] !== 'admin') {
                jsonResponse(['error' => 'Sin permisos'], 403);
            }

            // Verificar que el corte esté registrado
            $stmt = $db->prepare(
                "SELECT id FROM cortes
                 WHERE usuario_id = ? AND turno = ?
                 AND (fecha = ? OR fecha = DATE_ADD(?, INTERVAL 1 DAY))"
            );
            $stmt->execute([$turno['usuario_id'], $turno['tipo_turno'], $turno['fecha'], $turno['fecha']]);
            if (!$stmt->fetch()) {
                jsonResponse(['error' => 'Debes registrar tu corte antes de finalizar el turno.'], 400);
            }

            $db->prepare('UPDATE turnos SET estado = ? WHERE id = ?')->execute(['Finalizado', $id]);
            jsonResponse(['mensaje' => 'Turno finalizado correctamente']);
        }

        /* ── Actualización genérica (admin) ── */
        $campos = [];
        $params = [];
        foreach (['nombre_empleado', 'email', 'tipo_turno', 'fecha', 'estado'] as $f) {
            if (isset($body[$f])) { $campos[] = "$f = ?"; $params[] = $body[$f]; }
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
