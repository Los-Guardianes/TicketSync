-- ===========================================
-- PostgreSQL schema: tuticket
-- ===========================================
DROP SCHEMA IF EXISTS tuticket CASCADE;
CREATE SCHEMA tuticket;
SET search_path TO tuticket;
-- ===========================================
-- Enums
CREATE TYPE tipoDescuento AS ENUM ('MONTO', 'PORCENTAJE');
CREATE TYPE rolUsuario AS ENUM ('CLIENTE', 'ORGANIZADOR', 'ADMINISTRADOR');
CREATE TYPE tipoMoneda AS ENUM ('SOL', 'DOLAR');
CREATE TYPE estadoOrdenCompra AS ENUM ('PENDIENTE', 'ACEPTADA', 'CANCELADA');

-- ===========================================
-- Table: departamento
-- ===========================================
CREATE TABLE IF NOT EXISTS dpto (
    idDpto INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);
-- ===========================================
-- Table: ciudad
-- ===========================================
CREATE TABLE IF NOT EXISTS ciudad (
    idCiudad INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codPostal VARCHAR(10),
    activo BOOLEAN DEFAULT TRUE,
    idDpto INT NOT NULL,
    CONSTRAINT fk_ciudad_dpto FOREIGN KEY (idDpto)
        REFERENCES dpto (idDpto)
);

-- ===========================================
-- Table: usuario
-- ===========================================
CREATE TABLE IF NOT EXISTS usuario (
    idUsuario INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    hashCtr VARCHAR(255) NOT NULL,
    verificado BOOLEAN DEFAULT FALSE,
    telefono CHAR(9) UNIQUE,
    rol rolUsuario NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    idCiudad INT,
    CONSTRAINT fk_usuario_ciudad FOREIGN KEY (idCiudad)
        REFERENCES ciudad (idCiudad)
);
-- ===========================================
-- Table: Parametros globales
-- ===========================================
CREATE TABLE IF NOT EXISTS parametros_globales(
    idParametro INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comisionGlobal DECIMAL(5,2) NOT NULL
);
-- ===========================================
-- Table: administrador
-- ===========================================
CREATE TABLE IF NOT EXISTS admint (
    idUsuario INT PRIMARY KEY,
    CONSTRAINT fk_admint_usuario FOREIGN KEY (idUsuario)
        REFERENCES usuario (idUsuario)
);
-- ===========================================
-- Table: cliente
-- ===========================================
CREATE TABLE IF NOT EXISTS cliente (
    idUsuario INT PRIMARY KEY,
    DNI CHAR(8) NOT NULL UNIQUE,
	    fechaNacimiento DATE NOT NULL,
    CONSTRAINT fk_cliente_usuario FOREIGN KEY (idUsuario)
        REFERENCES usuario (idUsuario)
);

-- ===========================================
-- Table: organizador
-- ===========================================
CREATE TABLE IF NOT EXISTS organizador (
    idUsuario INT PRIMARY KEY,
    ruc CHAR(11) NOT NULL UNIQUE,
    razonSocial VARCHAR(150) NOT NULL,
    CONSTRAINT fk_organizador_usuario FOREIGN KEY (idUsuario)
        REFERENCES usuario (idUsuario)
);

-- ===========================================
-- Table: categoriaevento
-- ===========================================
CREATE TABLE IF NOT EXISTS categoria_evento (
    idCategoria INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    comision DECIMAL(5,2),
    activo BOOLEAN DEFAULT TRUE
);

-- ===========================================
-- Table: evento (Depende de ciudad, catevento)
-- ===========================================
CREATE TABLE IF NOT EXISTS evento (
    idEvento INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    informAdic TEXT,
    restricciones TEXT,
    urlImagen VARCHAR(255),
    urlMapa VARCHAR(255),
    direccion VARCHAR(255),
    moneda tipoMoneda NOT NULL,
    maxComprasTickets INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    idCiudad INT NOT NULL,
    idCategoria INT NOT NULL,
    idUsuario INT NOT NULL,
    CONSTRAINT fk_evento_usuario FOREIGN KEY (idUsuario)
        REFERENCES organizador (idUsuario),
    CONSTRAINT fk_evento_ciudad FOREIGN KEY (idCiudad)
        REFERENCES ciudad (idCiudad),
    CONSTRAINT fk_evento_categoria FOREIGN KEY (idCategoria)
        REFERENCES categoria_evento (idCategoria)
);

-- ===========================================
-- Table: descuento
-- ===========================================
CREATE TABLE IF NOT EXISTS descuento (
    idDescuento INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    tipoDesc tipoDescuento NOT NULL,
    valorDescuento DECIMAL(10,2) NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    limiteTotal INT NOT NULL,
    limiteCliente INT,
    esGlobal BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    idEvento INT,
    CONSTRAINT fk_descuento_evento FOREIGN KEY (idEvento)
        REFERENCES evento (idEvento)
);

-- ===========================================
-- Table: funcion
-- ===========================================
CREATE TABLE IF NOT EXISTS funcion (
    idFuncion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    horaInicio TIME NOT NULL,
    horaFin TIME NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    idEvento INT NOT NULL,
    CONSTRAINT fk_funcion_evento FOREIGN KEY (idEvento)
        REFERENCES evento (idEvento)
);

-- ===========================================
-- Table: tipoentrada
-- ===========================================
CREATE TABLE IF NOT EXISTS tipo_entrada (
    idTipoEntrada INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT FALSE,
	idEvento INT NOT NULL,
	CONSTRAINT fk_tipoentrada_evento FOREIGN KEY (idEvento)
        REFERENCES evento (idEvento)
);

-- ===========================================
-- Table: zona
-- ===========================================
CREATE TABLE IF NOT EXISTS zona (
    idZona INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    aforo INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    idEvento INT NOT NULL,
    CONSTRAINT fk_zona_evento FOREIGN KEY (idEvento)
        REFERENCES evento (idEvento)
);
-- ===========================================
-- Table: zona_funcion
-- ===========================================
CREATE TABLE IF NOT EXISTS zona_funcion (
    idZona      INT NOT NULL,
    idFuncion   INT NOT NULL,
    comprasActuales INT NOT NULL DEFAULT 0,
	activo BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (idZona, idFuncion),
    CONSTRAINT fk_zonafuncion_zona
        FOREIGN KEY (idZona) REFERENCES zona (idZona) ON DELETE CASCADE,
    CONSTRAINT fk_zonafuncion_funcion
        FOREIGN KEY (idFuncion) REFERENCES funcion (idFuncion) ON DELETE CASCADE,
    CONSTRAINT chk_zonafuncion_compras_nonneg CHECK (comprasActuales >= 0)
);

-- ===========================================
-- Table: temporada
-- ===========================================
CREATE TABLE IF NOT EXISTS periodo (
    idPeriodo INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Corregido: AS IDENTITY
    nombre VARCHAR(100),
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    tipoDesc tipoDescuento,
    valorDescuento DECIMAL(10,2),
    activo BOOLEAN DEFAULT FALSE,
    idEvento INT NOT NULL,
    CONSTRAINT fk_periodo_evento FOREIGN KEY (idEvento)
    	REFERENCES evento (idEvento)
);
-- ===========================================
-- Table: tarifa
-- ===========================================
CREATE TABLE IF NOT EXISTS tarifa (
	idTarifa INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	precioBase DECIMAL(10,2),
	activo BOOLEAN DEFAULT FALSE,
	idZona INT NOT NULL,
	idTipoEntrada INT NOT NULL,
  	CONSTRAINT fk_tarifa_zona FOREIGN KEY (idZona)
		REFERENCES zona (idZona),
	CONSTRAINT fk_tarifa_tipoentrada FOREIGN KEY (idTipoEntrada)
		REFERENCES tipo_entrada (idTipoEntrada)
);

-- ===========================================
-- Table: ordendecompra
-- ===========================================
CREATE TABLE IF NOT EXISTS orden_compra (
    idOrdenCompra INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fechaOrden TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodoPago VARCHAR(50) NOT NULL,
    estado estadoOrdenCompra NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
	totalBruto DECIMAL(10,2) NOT NULL,
	descuentoAplicado DECIMAL(10,2) NOT NULL,
	total DECIMAL(10,2) NOT NULL,
    idUsuario INT NOT NULL,
    idFuncion INT NOT NULL,
    CONSTRAINT fk_ordencompra_usuario FOREIGN KEY (idUsuario)
        REFERENCES usuario (idUsuario),
    CONSTRAINT fk_ordencompra_funcion FOREIGN KEY (idFuncion)
        REFERENCES funcion (idFuncion)
);
-- ===========================================
-- Table: detallecompra (Depende de ordencompra, entrada)
-- ===========================================
CREATE TABLE IF NOT EXISTS detalle_compra (
    idDetalleCompra INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cantidad INT NOT NULL,
    precioDetalle DECIMAL(5,2) NOT NULL,
    idOrdenCompra INT NOT NULL,
    idTarifa INT NOT NULL,
    idPeriodo INT NOT NULL,
    CONSTRAINT fk_detallecompra_ordencompra FOREIGN KEY (idOrdenCompra)
        REFERENCES orden_compra (idOrdenCompra),
    CONSTRAINT fk_detallecompra_tarifa FOREIGN KEY (idTarifa)
        REFERENCES tarifa (idTarifa),
    CONSTRAINT fk_detallecompra_periodo FOREIGN KEY (idPeriodo)
        REFERENCES periodo (idPeriodo)
);
-- ===========================================
-- Table: ticket (Depende de detallecompra)
-- ===========================================
CREATE TABLE IF NOT EXISTS ticket (
    idTicket INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Corregido: AS IDENTITY
    usado BOOLEAN DEFAULT FALSE,
    hashTicket VARCHAR NOT NULL,
    precioUnitario DECIMAL(5,2) NOT NULL,
    conceptoDevolucion DECIMAL(5,2) DEFAULT NULL,
    activo BOOLEAN DEFAULT TRUE,
	idDetalleCompra INT NOT NULL,
	CONSTRAINT fk_ticket_detallecompra FOREIGN KEY (idDetalleCompra)
        REFERENCES detalle_compra (idDetalleCompra)
);
-- ===========================================
-- Table: devolucion (Depende de detallecompra)
-- ===========================================
CREATE TABLE IF NOT EXISTS devolucion (
    idDevolucion INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fechaDev TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    porcentDev DECIMAL(5,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    idTicket INT NOT NULL,
    CONSTRAINT fk_devolucion_ticket FOREIGN KEY (idTicket)
        REFERENCES ticket (idTicket)
);
