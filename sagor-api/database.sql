-- Base de datos SAGOR - Sistema de Gestión de Recepción Hotelera
-- Hotel Chariot Mérida by Kavia

CREATE DATABASE IF NOT EXISTS sagor_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sagor_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100)  NOT NULL,
    email          VARCHAR(150)  NOT NULL UNIQUE,
    telefono       VARCHAR(20)   DEFAULT NULL,
    password       VARCHAR(255)  NOT NULL,
    turno          ENUM('Matutino','Vespertino','Nocturno','Administrador') NOT NULL DEFAULT 'Matutino',
    rol            ENUM('cajero','admin') NOT NULL DEFAULT 'cajero',
    token          VARCHAR(64)   DEFAULT NULL,
    fecha_registro TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS turnos (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT           NOT NULL,
    nombre_empleado VARCHAR(100)  NOT NULL,
    email           VARCHAR(150)  DEFAULT NULL,
    tipo_turno      ENUM('Matutino','Vespertino','Nocturno') NOT NULL,
    fecha           DATE          NOT NULL,
    estado          ENUM('Pendiente','Activo','Finalizado') NOT NULL DEFAULT 'Pendiente',
    created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cortes (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id            INT            NOT NULL,
    nombre_cajero         VARCHAR(100)   NOT NULL,
    turno                 ENUM('Matutino','Vespertino','Nocturno') NOT NULL,
    fecha                 DATE           NOT NULL,
    efectivo_total        DECIMAL(12,2)  NOT NULL DEFAULT 0,
    tarjetas_total        DECIMAL(12,2)  NOT NULL DEFAULT 0,
    bancos_total          DECIMAL(12,2)  NOT NULL DEFAULT 0,
    gastos_total          DECIMAL(12,2)  NOT NULL DEFAULT 0,
    total_general         DECIMAL(12,2)  NOT NULL DEFAULT 0,
    habitaciones_atendidas INT           NOT NULL DEFAULT 0,
    observaciones         TEXT           DEFAULT NULL,
    fecha_registro        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS detalle_efectivo (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    corte_id      INT           NOT NULL,
    denominacion  INT           NOT NULL,
    cantidad      INT           NOT NULL DEFAULT 0,
    subtotal      DECIMAL(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (corte_id) REFERENCES cortes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS detalle_tarjetas (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    corte_id INT           NOT NULL,
    tipo     VARCHAR(20)   NOT NULL,
    digitos  VARCHAR(4)    DEFAULT NULL,
    monto    DECIMAL(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (corte_id) REFERENCES cortes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS detalle_gastos (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    corte_id INT            NOT NULL,
    concepto VARCHAR(150)   NOT NULL,
    monto    DECIMAL(10,2)  NOT NULL DEFAULT 0,
    FOREIGN KEY (corte_id) REFERENCES cortes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS incidencias (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id  INT          NOT NULL,
    turno_id    INT          DEFAULT NULL,
    tipo        ENUM('Operativa','Mantenimiento','Seguridad','Huésped','Otro') NOT NULL DEFAULT 'Otro',
    prioridad   ENUM('Baja','Media','Alta') NOT NULL DEFAULT 'Media',
    descripcion TEXT         NOT NULL,
    estado      ENUM('Abierta','En proceso','Cerrada') NOT NULL DEFAULT 'Abierta',
    fecha       DATE         NOT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (turno_id)   REFERENCES turnos(id)   ON DELETE SET NULL
);
