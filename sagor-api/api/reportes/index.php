<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$db   = (new Database())->getConnection();
$auth = requireAuth($db);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Método no permitido'], 405);
}

$where  = [];
$params = [];

if (!empty($_GET['fecha_inicio'])) {
    $where[]  = 'c.fecha >= ?';
    $params[] = $_GET['fecha_inicio'];
}
if (!empty($_GET['fecha_fin'])) {
    $where[]  = 'c.fecha <= ?';
    $params[] = $_GET['fecha_fin'];
}
if (!empty($_GET['turno'])) {
    $where[]  = 'c.turno = ?';
    $params[] = $_GET['turno'];
}

$condicion = $where ? 'WHERE ' . implode(' AND ', $where) : '';

// Resumen general
$stmtResumen = $db->prepare(
    "SELECT
        COUNT(*)                    AS total_cortes,
        COALESCE(SUM(efectivo_total),   0) AS total_efectivo,
        COALESCE(SUM(tarjetas_total),   0) AS total_tarjetas,
        COALESCE(SUM(bancos_total),     0) AS total_bancos,
        COALESCE(SUM(gastos_total),     0) AS total_gastos,
        COALESCE(SUM(total_general),    0) AS total_general,
        COALESCE(SUM(habitaciones_atendidas), 0) AS total_habitaciones
     FROM cortes c $condicion"
);
$stmtResumen->execute($params);
$resumen = $stmtResumen->fetch();

// Detalle por corte
$stmtCortes = $db->prepare(
    "SELECT c.id, c.nombre_cajero, c.turno, c.fecha,
            c.efectivo_total, c.tarjetas_total, c.bancos_total,
            c.gastos_total, c.total_general, c.habitaciones_atendidas,
            c.observaciones, c.fecha_registro
     FROM cortes c $condicion
     ORDER BY c.fecha DESC, c.fecha_registro DESC"
);
$stmtCortes->execute($params);
$cortes = $stmtCortes->fetchAll();

// Agrupado por turno
$stmtTurno = $db->prepare(
    "SELECT
        c.turno,
        COUNT(*)                    AS cantidad_cortes,
        COALESCE(SUM(efectivo_total),  0) AS efectivo,
        COALESCE(SUM(tarjetas_total),  0) AS tarjetas,
        COALESCE(SUM(gastos_total),    0) AS gastos,
        COALESCE(SUM(total_general),   0) AS total
     FROM cortes c $condicion
     GROUP BY c.turno
     ORDER BY c.turno"
);
$stmtTurno->execute($params);
$por_turno = $stmtTurno->fetchAll();

// Totales por fecha (para gráficas)
$stmtFecha = $db->prepare(
    "SELECT
        c.fecha,
        COALESCE(SUM(efectivo_total), 0) AS efectivo,
        COALESCE(SUM(tarjetas_total), 0) AS tarjetas,
        COALESCE(SUM(total_general),  0) AS total
     FROM cortes c $condicion
     GROUP BY c.fecha
     ORDER BY c.fecha ASC"
);
$stmtFecha->execute($params);
$por_fecha = $stmtFecha->fetchAll();

jsonResponse([
    'resumen'   => $resumen,
    'cortes'    => $cortes,
    'por_turno' => $por_turno,
    'por_fecha' => $por_fecha,
]);
