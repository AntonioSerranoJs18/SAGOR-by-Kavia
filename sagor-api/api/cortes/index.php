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
            $stmt = $db->prepare('SELECT * FROM cortes WHERE id = ?');
            $stmt->execute([$id]);
            $corte = $stmt->fetch();
            if (!$corte) jsonResponse(['error' => 'Corte no encontrado'], 404);

            $stmt = $db->prepare('SELECT * FROM detalle_efectivo WHERE corte_id = ?');
            $stmt->execute([$id]);
            $corte['detalle_efectivo'] = $stmt->fetchAll();

            $stmt = $db->prepare('SELECT * FROM detalle_tarjetas WHERE corte_id = ?');
            $stmt->execute([$id]);
            $corte['detalle_tarjetas'] = $stmt->fetchAll();

            $stmt = $db->prepare('SELECT * FROM detalle_gastos WHERE corte_id = ?');
            $stmt->execute([$id]);
            $corte['detalle_gastos'] = $stmt->fetchAll();

            $stmt = $db->prepare('SELECT * FROM detalle_bancos WHERE corte_id = ?');
            $stmt->execute([$id]);
            $corte['detalle_bancos'] = $stmt->fetchAll();

            $stmt = $db->prepare('SELECT * FROM detalle_habitaciones WHERE corte_id = ?');
            $stmt->execute([$id]);
            $corte['detalle_habitaciones'] = $stmt->fetchAll();

            jsonResponse($corte);
        }

        $where  = [];
        $params = [];

        if (!empty($_GET['fecha_inicio'])) {
            $where[]  = 'fecha >= ?';
            $params[] = $_GET['fecha_inicio'];
        }
        if (!empty($_GET['fecha_fin'])) {
            $where[]  = 'fecha <= ?';
            $params[] = $_GET['fecha_fin'];
        }
        if (!empty($_GET['turno'])) {
            $where[]  = 'turno = ?';
            $params[] = $_GET['turno'];
        }

        $sql = 'SELECT * FROM cortes';
        if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY fecha DESC, fecha_registro DESC';

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        jsonResponse($stmt->fetchAll());

    case 'POST':
        $body     = getRequestBody();
        $required = ['turno', 'fecha', 'efectivo_total', 'tarjetas_total', 'gastos_total', 'total_general'];
        foreach ($required as $field) {
            if (!isset($body[$field])) jsonResponse(['error' => "Campo requerido: $field"], 400);
        }

        try {
            $db->beginTransaction();

            $stmt = $db->prepare(
                'INSERT INTO cortes
                    (usuario_id, nombre_cajero, turno, fecha, efectivo_total, tarjetas_total,
                     bancos_total, gastos_total, total_general, habitaciones_atendidas, observaciones)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $auth['id'],
                $body['nombre_cajero'] ?? $auth['nombre'],
                $body['turno'],
                $body['fecha'],
                $body['efectivo_total'],
                $body['tarjetas_total'],
                $body['bancos_total']           ?? 0,
                $body['gastos_total'],
                $body['total_general'],
                $body['habitaciones_atendidas'] ?? 0,
                $body['observaciones']          ?? null,
            ]);
            $corteId = $db->lastInsertId();

            insertarDetalles($db, $corteId, $body);

            $db->commit();
            jsonResponse(['mensaje' => 'Corte registrado', 'id' => $corteId], 201);

        } catch (Exception $e) {
            $db->rollBack();
            jsonResponse(['error' => 'Error al registrar el corte'], 500);
        }

    case 'PUT':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requerido'], 400);

        $stmt = $db->prepare('SELECT usuario_id FROM cortes WHERE id = ?');
        $stmt->execute([$id]);
        $corte = $stmt->fetch();
        if (!$corte) jsonResponse(['error' => 'Corte no encontrado'], 404);
        if ($auth['rol'] !== 'admin' && (int)$corte['usuario_id'] !== (int)$auth['id']) {
            jsonResponse(['error' => 'Sin permisos'], 403);
        }

        $body     = getRequestBody();
        $required = ['turno', 'fecha', 'efectivo_total', 'tarjetas_total', 'gastos_total', 'total_general'];
        foreach ($required as $field) {
            if (!isset($body[$field])) jsonResponse(['error' => "Campo requerido: $field"], 400);
        }

        try {
            $db->beginTransaction();

            $stmt = $db->prepare(
                'UPDATE cortes SET turno=?, fecha=?, efectivo_total=?, tarjetas_total=?,
                 bancos_total=?, gastos_total=?, total_general=?, habitaciones_atendidas=?,
                 observaciones=? WHERE id=?'
            );
            $stmt->execute([
                $body['turno'],
                $body['fecha'],
                $body['efectivo_total'],
                $body['tarjetas_total'],
                $body['bancos_total']           ?? 0,
                $body['gastos_total'],
                $body['total_general'],
                $body['habitaciones_atendidas'] ?? 0,
                $body['observaciones']          ?? null,
                $id,
            ]);

            foreach (['detalle_efectivo','detalle_tarjetas','detalle_gastos','detalle_bancos','detalle_habitaciones'] as $t) {
                $db->prepare("DELETE FROM $t WHERE corte_id = ?")->execute([$id]);
            }

            insertarDetalles($db, $id, $body);

            $db->commit();
            jsonResponse(['mensaje' => 'Corte actualizado']);

        } catch (Exception $e) {
            $db->rollBack();
            jsonResponse(['error' => 'Error al actualizar el corte'], 500);
        }

    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requerido'], 400);

        $stmt = $db->prepare('SELECT usuario_id FROM cortes WHERE id = ?');
        $stmt->execute([$id]);
        $corte = $stmt->fetch();
        if (!$corte) jsonResponse(['error' => 'Corte no encontrado'], 404);
        if ($auth['rol'] !== 'admin' && (int)$corte['usuario_id'] !== (int)$auth['id']) {
            jsonResponse(['error' => 'Sin permisos'], 403);
        }

        $db->prepare('DELETE FROM cortes WHERE id = ?')->execute([$id]);
        jsonResponse(['mensaje' => 'Corte eliminado']);

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}

/* ── helper reutilizable para insertar detalles ── */
function insertarDetalles(PDO $db, int $corteId, array $body): void
{
    if (!empty($body['detalle_efectivo'])) {
        $st = $db->prepare('INSERT INTO detalle_efectivo (corte_id, denominacion, cantidad, subtotal) VALUES (?, ?, ?, ?)');
        foreach ($body['detalle_efectivo'] as $r) {
            $st->execute([$corteId, $r['denominacion'], $r['cantidad'], $r['subtotal']]);
        }
    }
    if (!empty($body['detalle_tarjetas'])) {
        $st = $db->prepare('INSERT INTO detalle_tarjetas (corte_id, tipo, ultimos_cuatro, monto) VALUES (?, ?, ?, ?)');
        foreach ($body['detalle_tarjetas'] as $r) {
            $st->execute([$corteId, $r['tipo'], $r['digitos'] ?? null, $r['monto']]);
        }
    }
    if (!empty($body['detalle_gastos'])) {
        $st = $db->prepare('INSERT INTO detalle_gastos (corte_id, concepto, monto) VALUES (?, ?, ?)');
        foreach ($body['detalle_gastos'] as $r) {
            $st->execute([$corteId, $r['concepto'], $r['monto']]);
        }
    }
    if (!empty($body['detalle_bancos'])) {
        $st = $db->prepare('INSERT INTO detalle_bancos (corte_id, deposito, monto) VALUES (?, ?, ?)');
        foreach ($body['detalle_bancos'] as $r) {
            $st->execute([$corteId, $r['deposito'], $r['monto']]);
        }
    }
    if (!empty($body['detalle_habitaciones'])) {
        $st = $db->prepare(
            'INSERT INTO detalle_habitaciones (corte_id, habitacion, cantidad, folio, forma_pago, descripcion)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        foreach ($body['detalle_habitaciones'] as $r) {
            $st->execute([
                $corteId,
                $r['habitacion'],
                $r['cantidad']    ?? 1,
                $r['folio']       ?? null,
                $r['forma_pago']  ?? null,
                $r['descripcion'] ?? null,
            ]);
        }
    }
}
