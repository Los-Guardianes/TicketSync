SET search_path TO tuticket;

-- ===========================================
-- Crear Departamento
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_dpto(
    p_nombre VARCHAR,
    p_activo BOOLEAN DEFAULT TRUE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idDpto INT;
BEGIN
    INSERT INTO tuticket.dpto (nombre, activo)
    VALUES (p_nombre, p_activo)
    RETURNING idDpto INTO nuevo_idDpto;

    RETURN nuevo_idDpto;
END;
$$;

-- ===========================================
-- Crear Ciudad
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_ciudad(
    p_nombre VARCHAR,
    p_idDpto INT,
    p_codPostal VARCHAR DEFAULT NULL,
    p_activo BOOLEAN DEFAULT TRUE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idCiudad INT;
BEGIN
    INSERT INTO tuticket.ciudad (nombre, idDpto, codPostal, activo)
    VALUES (p_nombre, p_idDpto, p_codPostal, p_activo)
    RETURNING idCiudad INTO nuevo_idCiudad;

    RETURN nuevo_idCiudad;
END;
$$;

-- ===========================================
-- Crear Usuario
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_usuario(
    p_nombre VARCHAR(100),
    p_apellido VARCHAR(100),
    p_email VARCHAR(150),
    p_hashCtr VARCHAR(255),
    p_rol rolUsuario,
    p_idCiudad INT,
    p_verificado BOOLEAN DEFAULT FALSE,
    p_telefono CHAR(9) DEFAULT NULL,
    p_activo BOOLEAN DEFAULT TRUE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    v_idUsuario INT;
BEGIN
    INSERT INTO tuticket.usuario (
        nombre, apellido, email, hashCtr, verificado, telefono, activo, rol, idCiudad
    ) VALUES (
        p_nombre, p_apellido, p_email, p_hashCtr, p_verificado, p_telefono, p_activo, p_rol, p_idCiudad
    )
    RETURNING idUsuario INTO v_idUsuario;

    RETURN v_idUsuario;
END;
$$;

-- ===========================================
-- Crear Cliente
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_cliente(
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_email VARCHAR,
    p_hashCtr VARCHAR,
    p_DNI CHAR(8),
    p_fechaNacimiento DATE,
    p_idCiudad INT,
    p_verificado BOOLEAN DEFAULT FALSE,
    p_telefono CHAR(9) DEFAULT NULL,
    p_activo BOOLEAN DEFAULT TRUE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idUsuario INT;
BEGIN
    nuevo_idUsuario := tuticket.crear_usuario(
        p_nombre, p_apellido, p_email, p_hashCtr, 'CLIENTE'::rolUsuario, p_idCiudad,
        p_verificado, p_telefono, p_activo
    );

    INSERT INTO tuticket.cliente (idUsuario, DNI, fechaNacimiento)
    VALUES (nuevo_idUsuario, p_DNI, p_fechaNacimiento);

    RETURN nuevo_idUsuario;
END;
$$;

-- ===========================================
-- Crear Parametros Globales
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_parametros_globales(
    p_comisionGlobal DECIMAL(5,2)
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idParametro INT;
BEGIN
    INSERT INTO tuticket.parametros_globales (comisionGlobal)
    VALUES (p_comisionGlobal)
    RETURNING idParametro INTO nuevo_idParametro;

    RETURN nuevo_idParametro;
END;
$$;

-- ===========================================
-- Crear Admin
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_admin(
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_email VARCHAR,
    p_hashCtr VARCHAR,
    p_idCiudad INT,
    p_verificado BOOLEAN DEFAULT FALSE,
    p_telefono CHAR(9) DEFAULT NULL,
    p_activo BOOLEAN DEFAULT TRUE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idUsuario INT;
BEGIN
    nuevo_idUsuario := tuticket.crear_usuario(
        p_nombre, p_apellido, p_email, p_hashCtr, 'ADMINISTRADOR'::rolUsuario, p_idCiudad,
        p_verificado, p_telefono, p_activo
    );

    -- CAMBIO: Tabla es 'admint' y 'comisionGlobal' se movió a 'parametros_globales'
    INSERT INTO tuticket.admint (idUsuario)
    VALUES (nuevo_idUsuario);

    RETURN nuevo_idUsuario;
END;
$$;

-- ===========================================
-- Crear Organizador
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_organizador(
    p_nombre VARCHAR,
    p_apellido VARCHAR,
    p_email VARCHAR,
    p_hashCtr VARCHAR,
    p_ruc CHAR(11),
    p_razonSocial VARCHAR,
    p_idCiudad INT,
    p_verificado BOOLEAN DEFAULT FALSE,
    p_telefono CHAR(9) DEFAULT NULL,
    p_activo BOOLEAN DEFAULT TRUE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idUsuario INT;
BEGIN
    nuevo_idUsuario := tuticket.crear_usuario(
        p_nombre, p_apellido, p_email, p_hashCtr, 'ORGANIZADOR'::rolUsuario, p_idCiudad,
        p_verificado, p_telefono, p_activo
    );

    INSERT INTO tuticket.organizador (idUsuario, ruc, razonSocial)
    VALUES (nuevo_idUsuario, p_ruc, p_razonSocial);

    RETURN nuevo_idUsuario;
END;
$$;

-- ===========================================
-- Crear Categoría Evento
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_categoria_evento( -- CAMBIO: Nombre de funcion
    p_nombre VARCHAR,
    p_comision DECIMAL(5,2),
    p_activo BOOLEAN DEFAULT TRUE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idCategoria INT;
BEGIN
    -- CAMBIO: Nombre de tabla 'catevento' -> 'categoria_evento'
    INSERT INTO tuticket.categoria_evento (nombre, comision, activo)
    VALUES (p_nombre, p_comision, p_activo)
    RETURNING idCategoria INTO nuevo_idCategoria;

    RETURN nuevo_idCategoria;
END;
$$;

-- ===========================================
-- Crear Evento
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_evento(
    p_nombre VARCHAR,
    p_direccion VARCHAR,
    p_idCiudad INT,
    p_idCategoria INT,
	p_idUsuario INT, -- CAMBIO: Añadido (NOT NULL)
    p_moneda tipoMoneda, -- CAMBIO: Añadido (NOT NULL)
    p_maxComprasTickets INT, -- CAMBIO: Añadido (NOT NULL)
    p_descripcion TEXT DEFAULT NULL,
    p_informAdic TEXT DEFAULT NULL,
    p_restricciones TEXT DEFAULT NULL,
    p_urlImagen VARCHAR DEFAULT NULL,
    p_urlMapa VARCHAR DEFAULT NULL,
    p_activo BOOLEAN DEFAULT TRUE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idEvento INT;
BEGIN
    INSERT INTO tuticket.evento (
        nombre, descripcion, informAdic, restricciones, urlImagen, urlMapa,
        direccion, activo, idCiudad, idCategoria,
        -- CAMBIO: Columnas añadidas
        idUsuario, moneda, maxComprasTickets
    )
    VALUES (
        p_nombre, p_descripcion, p_informAdic, p_restricciones, p_urlImagen,
        p_urlMapa, p_direccion, p_activo, p_idCiudad, p_idCategoria,
        -- CAMBIO: Valores añadidos
        p_idUsuario, p_moneda, p_maxComprasTickets
    )
    RETURNING idEvento INTO nuevo_idEvento;
    
    RETURN nuevo_idEvento;
END;
$$;

-- ===========================================
-- Crear Descuento
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_descuento(
    p_codigo VARCHAR,
    p_tipoDesc tipoDescuento,
    p_valorDescuento DECIMAL(10,2),
    p_fechaInicio DATE,
    p_fechaFin DATE,
    p_limiteTotal INT,
    p_limiteCliente INT DEFAULT NULL,
    p_esGlobal BOOLEAN DEFAULT FALSE,
    p_activo BOOLEAN DEFAULT TRUE,
    p_idEvento INT DEFAULT NULL
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idDescuento INT;
BEGIN
    INSERT INTO tuticket.descuento (
        codigo, tipoDesc, valorDescuento, fechaInicio, fechaFin,
        limiteTotal, limiteCliente, esGlobal, activo, idEvento
    ) VALUES (
        p_codigo, p_tipoDesc, p_valorDescuento, p_fechaInicio, p_fechaFin,
        p_limiteTotal, p_limiteCliente, p_esGlobal, p_activo, p_idEvento
    )
    RETURNING idDescuento INTO nuevo_idDescuento;

    RETURN nuevo_idDescuento;
END;
$$;

-- ===========================================
-- Crear Función
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_funcion(
    p_idEvento INT,
    p_tsInicio TIMESTAMP, -- Parámetro unificado
    p_tsFin TIMESTAMP, -- Parámetro unificado
    p_activo BOOLEAN DEFAULT TRUE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idFuncion INT;
BEGIN
    -- CAMBIO: Se extrae DATE y TIME de los TIMESTAMP para coincidir con el schema
    INSERT INTO tuticket.funcion (
        idEvento, 
        fechaInicio, 
        fechaFin, 
        horaInicio,
        horaFin,
        activo
    ) VALUES (
        p_idEvento, 
        p_tsInicio::DATE, 
        p_tsFin::DATE,
        p_tsInicio::TIME,
        p_tsFin::TIME,
        p_activo
    )
    RETURNING idFuncion INTO nuevo_idFuncion;

    RETURN nuevo_idFuncion;
END;
$$;

-- ===========================================
-- Crear TipoEntrada
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_tipoentrada(
    p_nombre VARCHAR,
    p_idEvento INT, -- CAMBIO: Añadido (NOT NULL)
    p_descripcion TEXT DEFAULT NULL,
    p_activo BOOLEAN DEFAULT FALSE -- CAMBIO: DEFAULT en schema es FALSE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idTipoEntrada INT;
BEGIN
    -- CAMBIO: Tabla es 'tipo_entrada'.
    -- CAMBIO: Columnas 'moneda', 'precioBase', 'cantidadMax' eliminadas.
    -- CAMBIO: 'idEvento' añadida.
    INSERT INTO tuticket.tipo_entrada (
        nombre, descripcion, activo, idEvento
    ) VALUES (
        p_nombre, p_descripcion, p_activo, p_idEvento
    )
    RETURNING idTipoEntrada INTO nuevo_idTipoEntrada;

    RETURN nuevo_idTipoEntrada;
END;
$$;

-- ===========================================
-- Crear Zona
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_zona(
    p_nombre VARCHAR,
    p_aforo INT, -- CAMBIO: 'numAsientos' -> 'aforo'
    p_idEvento INT,
    p_activo BOOLEAN DEFAULT TRUE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idZona INT;
BEGIN
    -- CAMBIO: 'numAsientos' -> 'aforo'. 'idTipoEntrada' eliminado.
    -- 'comprasActuales' usará su DEFAULT 0.
    INSERT INTO tuticket.zona (
        nombre, aforo, idEvento, activo
    ) VALUES (
        p_nombre, p_aforo, p_idEvento, p_activo
    )
    RETURNING idZona INTO nuevo_idZona;

    RETURN nuevo_idZona;
END;
$$;

-- ===========================================
-- Crear Periodo (antes Temporada)
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_periodo( -- CAMBIO: Nombre de funcion
    p_nombre VARCHAR,
    p_fechaInicio DATE,
    p_fechaFin DATE,
    p_tipoDesc tipoDescuento, -- CAMBIO: de 'porcentajeDesc'
    p_valorDescuento DECIMAL(10,2), -- CAMBIO: a 'tipoDesc' y 'valorDescuento'
    p_idEvento INT,
    p_activo BOOLEAN DEFAULT FALSE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idPeriodo INT;
BEGIN
    -- CAMBIO: Tabla 'temporada' -> 'periodo'.
    -- CAMBIO: Columnas de descuento actualizadas.
    INSERT INTO tuticket.periodo (
        nombre, fechaInicio, fechaFin, tipoDesc, valorDescuento, activo, idEvento
    ) VALUES (
        p_nombre, p_fechaInicio, p_fechaFin, p_tipoDesc, p_valorDescuento, p_activo, p_idEvento
    )
    RETURNING idPeriodo INTO nuevo_idPeriodo;

    RETURN nuevo_idPeriodo;
END;
$$;

-- ===========================================
-- Crear Tarifa (Reemplaza 'Entrada')
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_tarifa(
    p_precioBase DECIMAL(10,2),
    p_idZona INT,
    p_idTipoEntrada INT,
    p_activo BOOLEAN DEFAULT FALSE -- Schema default es FALSE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idTarifa INT;
BEGIN
    INSERT INTO tuticket.tarifa (
        precioBase, activo, idZona, idTipoEntrada
    ) VALUES (
        p_precioBase, p_activo, p_idZona, p_idTipoEntrada
    )
    RETURNING idTarifa INTO nuevo_idTarifa;

    RETURN nuevo_idTarifa;
END;
$$;


-- ===========================================
-- Crear Orden de Compra
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_ordencompra(
    p_idUsuario INT,
    p_idFuncion INT,
    p_metodoPago VARCHAR,
    p_estado estadoOrdenCompra,
    p_totalBruto DECIMAL(10,2),
    p_descuentoAplicado DECIMAL(10,2),
    p_total DECIMAL(10,2)
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    nuevo_idOrdenCompra INT;
BEGIN
    INSERT INTO tuticket.orden_compra (
        idUsuario,
        idFuncion,
        metodoPago,
        estado,
        totalBruto,
        descuentoAplicado,
        total
    )
    VALUES (
        p_idUsuario,
        p_idFuncion,
        p_metodoPago,
        p_estado,
        p_totalBruto,
        p_descuentoAplicado,
        p_total
    )
    RETURNING idOrdenCompra INTO nuevo_idOrdenCompra;

    RETURN nuevo_idOrdenCompra;
END;
$$;

-- ===========================================
-- Crear DetalleCompra
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_detallecompra(
    p_idOrdenCompra INT,
    p_idTarifa INT, -- CAMBIO: 'idEntrada' -> 'idTarifa'
    p_idPeriodo INT, -- CAMBIO: Añadido (NOT NULL)
    p_cantidad INT,
    p_precioDetalle DECIMAL(5,2) -- CAMBIO: Añadido (NOT NULL)
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idDetalleCompra INT;
BEGIN
    -- CAMBIO: Tabla 'detallecompra' -> 'detalle_compra'
    -- CAMBIO: Columnas actualizadas para usar 'idTarifa', 'idPeriodo' y 'precioDetalle'
    INSERT INTO tuticket.detalle_compra (
        idOrdenCompra, idTarifa, idPeriodo, cantidad, precioDetalle
    ) VALUES (
        p_idOrdenCompra, p_idTarifa, p_idPeriodo, p_cantidad, p_precioDetalle
    )
    RETURNING idDetalleCompra INTO nuevo_idDetalleCompra;

    RETURN nuevo_idDetalleCompra;
END;
$$;

-- ===========================================
-- Crear Ticket
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_ticket(
    p_idDetalleCompra INT,
    p_hashTicket VARCHAR, -- CAMBIO: Añadido (NOT NULL)
    p_precioUnitario DECIMAL(5,2), -- CAMBIO: Añadido (NOT NULL)
    p_usado BOOLEAN DEFAULT FALSE
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idTicket INT;
BEGIN
    -- CAMBIO: Añadidas columnas 'hashTicket' y 'precioUnitario'
    -- 'conceptoDevolucion' y 'activo' usarán sus DEFAULTs.
    INSERT INTO tuticket.ticket (
        idDetalleCompra, usado, hashTicket, precioUnitario
    )
    VALUES (
        p_idDetalleCompra, p_usado, p_hashTicket, p_precioUnitario
    )
    RETURNING idTicket INTO nuevo_idTicket;

    RETURN nuevo_idTicket;
END;
$$;

-- ===========================================
-- Crear Devolución
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_devolucion(
    p_porcentDev DECIMAL(5,2),
    p_idTicket INT -- CAMBIO: 'idDetalleCompra' -> 'idTicket'
)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    nuevo_idDevolucion INT;
BEGIN
    -- CAMBIO: FK apunta a 'idTicket'. 'activo' usará su DEFAULT.
    INSERT INTO tuticket.devolucion (
        porcentDev, idTicket
    ) VALUES (
        p_porcentDev, p_idTicket
    )
    RETURNING idDevolucion INTO nuevo_idDevolucion;

    RETURN nuevo_idDevolucion;
END;
$$;
-- ===========================================
-- Crear vínculo Zona - Función 
-- ===========================================
CREATE OR REPLACE FUNCTION tuticket.crear_funcion_zona(
    p_idZona INT,
    p_idFuncion INT,
    p_comprasIniciales INT DEFAULT 0
)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
    v_idEvento_zona INT;
    v_idEvento_funcion INT;
    v_aforo INT;
    v_exists INT;
BEGIN
    -- Validar zona
    SELECT z.idEvento, z.aforo
    INTO v_idEvento_zona, v_aforo
    FROM tuticket.zona z
    WHERE z.idZona = p_idZona;

    IF v_idEvento_zona IS NULL THEN
        RAISE EXCEPTION 'Zona % no existe', p_idZona;
    END IF;

    -- Validar función
    SELECT f.idEvento
    INTO v_idEvento_funcion
    FROM tuticket.funcion f
    WHERE f.idFuncion = p_idFuncion;

    IF v_idEvento_funcion IS NULL THEN
        RAISE EXCEPTION 'Función % no existe', p_idFuncion;
    END IF;

    -- Deben pertenecer al mismo evento
    IF v_idEvento_zona <> v_idEvento_funcion THEN
        RAISE EXCEPTION 'Zona % y Función % pertenecen a eventos distintos (% <> %)',
            p_idZona, p_idFuncion, v_idEvento_zona, v_idEvento_funcion;
    END IF;

    -- Validaciones de comprasIniciales
    IF p_comprasIniciales < 0 THEN
        RAISE EXCEPTION 'comprasIniciales no puede ser negativo';
    END IF;

    IF p_comprasIniciales > v_aforo THEN
        RAISE EXCEPTION 'comprasIniciales (%) excede el aforo de la zona (%)',
            p_comprasIniciales, v_aforo;
    END IF;

    -- Evitar duplicados
    SELECT 1
    INTO v_exists
    FROM tuticket.zona_funcion zf
    WHERE zf.idZona = p_idZona AND zf.idFuncion = p_idFuncion;

    IF v_exists IS NOT NULL THEN
        RAISE EXCEPTION 'Ya existe el vínculo zona_funcion (zona %, función %)',
            p_idZona, p_idFuncion;
    END IF;

    -- Crear vínculo
    INSERT INTO tuticket.zona_funcion (idZona, idFuncion, comprasActuales)
    VALUES (p_idZona, p_idFuncion, p_comprasIniciales);
END;
$$;
