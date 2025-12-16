SET search_path TO tuticket;

-- =====================
-- 1) DEPARTAMENTOS (10)
-- =====================
SELECT tuticket.crear_dpto('Lima', TRUE);
SELECT tuticket.crear_dpto('Arequipa', TRUE);
SELECT tuticket.crear_dpto('Cusco', TRUE);
SELECT tuticket.crear_dpto('Piura', TRUE);
SELECT tuticket.crear_dpto('La Libertad', TRUE);
SELECT tuticket.crear_dpto('Tacna', TRUE);
SELECT tuticket.crear_dpto('Loreto', TRUE);
SELECT tuticket.crear_dpto('Junín', TRUE);
SELECT tuticket.crear_dpto('Ayacucho', TRUE);
SELECT tuticket.crear_dpto('Puno', TRUE);

-- =====================
-- 2) CIUDADES (10)
-- =====================
SELECT tuticket.crear_ciudad('Lima Metropolitana', 1, '15001', TRUE);
SELECT tuticket.crear_ciudad('Arequipa Centro', 2, '04001', TRUE);
SELECT tuticket.crear_ciudad('Cusco Ciudad', 3, '08001', TRUE);
SELECT tuticket.crear_ciudad('Piura Ciudad', 4, '20001', TRUE);
SELECT tuticket.crear_ciudad('Trujillo', 5, '13001', TRUE);
SELECT tuticket.crear_ciudad('Tacna Ciudad', 6, '23001', TRUE);
SELECT tuticket.crear_ciudad('Iquitos', 7, '16001', TRUE);
SELECT tuticket.crear_ciudad('Huancayo', 8, '12001', TRUE);
SELECT tuticket.crear_ciudad('Ayacucho Ciudad', 9, '05001', TRUE);
SELECT tuticket.crear_ciudad('Puno Ciudad', 10, '21001', TRUE);

-- =====================
-- 3) CATEGORÍAS (10)
-- =====================
SELECT tuticket.crear_categoria_evento('Conciertos', 10.00, TRUE);
SELECT tuticket.crear_categoria_evento('Teatro', 8.50, TRUE);
SELECT tuticket.crear_categoria_evento('Deportes', 12.00, TRUE);
SELECT tuticket.crear_categoria_evento('Festivales', 15.00, TRUE);
SELECT tuticket.crear_categoria_evento('Conferencias', 5.50, TRUE);
SELECT tuticket.crear_categoria_evento('Cine', 7.00, TRUE);
SELECT tuticket.crear_categoria_evento('Exposiciones', 6.50, TRUE);
SELECT tuticket.crear_categoria_evento('Ferias', 9.00, TRUE);
SELECT tuticket.crear_categoria_evento('Religiosos', 4.50, TRUE);
SELECT tuticket.crear_categoria_evento('Otros', 3.00, TRUE);

-- =====================
-- 4) PARÁMETROS GLOBALES
-- =====================
SELECT tuticket.crear_parametros_globales(7.50);

-- =====================
-- 5) CLIENTES (10) -> usuarios 1..10
-- =====================
SELECT tuticket.crear_cliente('Mario', 'Lopez', 'mario1@mail.com', 'hash11', '12345678', '1990-05-20', 1, TRUE, '999111111', TRUE);
SELECT tuticket.crear_cliente('Lucia', 'Fernandez', 'lucia2@mail.com', 'hash12', '23456789', '1995-07-15', 2, TRUE, '999111112', TRUE);
SELECT tuticket.crear_cliente('Carlos', 'Ramirez', 'carlos3@mail.com', 'hash13', '34567890', '1988-03-10', 3, FALSE, '999111113', TRUE);
SELECT tuticket.crear_cliente('Elena', 'Castro', 'elena4@mail.com', 'hash14', '45678901', '1992-09-25', 4, TRUE, '999111114', TRUE);
SELECT tuticket.crear_cliente('Jorge', 'Martinez', 'jorge5@mail.com', 'hash15', '56789012', '1985-11-05', 5, TRUE, '999111115', TRUE);
SELECT tuticket.crear_cliente('Patricia', 'Gomez', 'paty6@mail.com', 'hash16', '67890123', '1998-02-14', 6, FALSE, '999111116', TRUE);
SELECT tuticket.crear_cliente('Hector', 'Diaz', 'hector7@mail.com', 'hash17', '78901234', '1993-06-30', 7, TRUE, '999111117', TRUE);
SELECT tuticket.crear_cliente('Carmen', 'Torres', 'carmen8@mail.com', 'hash18', '89012345', '1987-12-19', 8, TRUE, '999111118', TRUE);
SELECT tuticket.crear_cliente('Diego', 'Mendoza', 'diego9@mail.com', 'hash19', '90123456', '1991-08-08', 9, TRUE, '999111119', TRUE);
SELECT tuticket.crear_cliente('Ana', 'Rojas', 'ana10@mail.com', 'hash20', '11223344', '1994-04-04', 10, TRUE, '999111120', TRUE);

-- =====================
-- 6) ADMINS (11) -> usuarios 11..20
-- =====================
SELECT tuticket.crear_admin('Sofia', 'Aguilar', 'sofia1@mail.com', 'hash21', 1, TRUE, '999222111', TRUE);
SELECT tuticket.crear_admin('Ricardo', 'Campos', 'ricardo2@mail.com', 'hash22', 2, TRUE, '999222112', TRUE);
SELECT tuticket.crear_admin('Monica', 'Alvarez', 'monica3@mail.com', 'hash23', 3, TRUE, '999222113', TRUE);
SELECT tuticket.crear_admin('Fernando', 'Gutierrez', 'fer4@mail.com', 'hash24', 4, TRUE, '999222114', TRUE);
SELECT tuticket.crear_admin('Claudia', 'Paredes', 'claudia5@mail.com', 'hash25', 5, TRUE, '999222115', TRUE);
SELECT tuticket.crear_admin('Hugo', 'Silva', 'hugo6@mail.com', 'hash26', 6, TRUE, '999222116', TRUE);
SELECT tuticket.crear_admin('Paola', 'Morales', 'paola7@mail.com', 'hash27', 7, TRUE, '999222117', TRUE);
SELECT tuticket.crear_admin('Daniel', 'Herrera', 'daniel8@mail.com', 'hash28', 8, TRUE, '999222118', TRUE);
SELECT tuticket.crear_admin('Rosa', 'Flores', 'rosa9@mail.com', 'hash29', 9, TRUE, '999222119', TRUE);
SELECT tuticket.crear_admin('Alberto', 'Reyes', 'alberto10@mail.com', 'hash30', 10, TRUE, '999222120', TRUE);

-- =====================
-- 7) ORGANIZADORES (10) -> usuarios 21..30
-- =====================
SELECT tuticket.crear_organizador('Clara', 'Vega', 'clara1@mail.com', 'hash31', '20123456781', 'Eventos Clara SAC', 1, TRUE, '999333111', TRUE);
SELECT tuticket.crear_organizador('Pedro', 'Santos', 'pedro2@mail.com', 'hash32', '20456789123', 'Producciones Santos', 2, TRUE, '999333112', TRUE);
SELECT tuticket.crear_organizador('Laura', 'Matos', 'laura3@mail.com', 'hash33', '20987654321', 'Eventos Matos EIRL', 3, TRUE, '999333113', TRUE);
SELECT tuticket.crear_organizador('Miguel', 'Perez', 'miguel4@mail.com', 'hash34', '20543219876', 'MP Eventos', 4, TRUE, '999333114', TRUE);
SELECT tuticket.crear_organizador('Isabel', 'Garcia', 'isabel5@mail.com', 'hash35', '20678912345', 'Garcia Producciones', 5, TRUE, '999333115', TRUE);
SELECT tuticket.crear_organizador('Roberto', 'Lopez', 'roberto6@mail.com', 'hash36', '20765432198', 'Lopez Shows SAC', 6, TRUE, '999333116', TRUE);
SELECT tuticket.crear_organizador('Natalia', 'Ramos', 'natalia7@mail.com', 'hash37', '20812345679', 'NR Eventos SAC', 7, TRUE, '999333117', TRUE);
SELECT tuticket.crear_organizador('Oscar', 'Jimenez', 'oscar8@mail.com', 'hash38', '20911223344', 'OJ Producciones', 8, TRUE, '999333118', TRUE);
SELECT tuticket.crear_organizador('Veronica', 'Salazar', 'vero9@mail.com', 'hash39', '20199887766', 'Salazar Music SAC', 9, TRUE, '999333119', TRUE);
SELECT tuticket.crear_organizador('Andres', 'Torres', 'andres10@mail.com', 'hash40', '20222334455', 'Torres Eventos SAC', 10, TRUE, '999333120', TRUE);
SELECT tuticket.crear_admin('Luis', 'Flores', 'luis.flores@pucp.edu.pe', 'pwd43210', 1, TRUE, '000000000', TRUE);
-- =====================
-- 8) EVENTOS (10) -> eventos 1..10
--   * evento 1 = pasado (2025)
--   * eventos 2..10 => planeados; funciones principales en 2026
-- =====================
SELECT tuticket.crear_evento('Concierto Rock Lima', 'Av. Principal 123, Lima', 1, 1, 21, 'SOL'::tipoMoneda, 10, 'Banda internacional', 'Aforo 10k', 'No menores', 'https://tuticket-bucket.s3.us-east-1.amazonaws.com/concierto_rock_lima.jpg', 'maps/rock.png', TRUE);
SELECT tuticket.crear_evento('Teatro Clásico Arequipa', 'Calle Mercaderes 250, Arequipa', 2, 2, 22, 'SOL'::tipoMoneda, 8, 'Obra reconocida', 'Duración 2h', 'No fotos', 'https://tuticket-bucket.s3.us-east-1.amazonaws.com/teatro_clasico_arequipa.jpg', 'maps/teatro.png', TRUE);
SELECT tuticket.crear_evento('Partido Cusco', 'Estadio Garcilaso, Cusco', 3, 3, 23, 'SOL'::tipoMoneda, 10, 'Clásico local', 'Aforo 20k', 'No bebidas', 'img/futbol.jpg', 'https://tuticket-bucket.s3.us-east-1.amazonaws.com/teatro_clasico_arequipa.jpg', TRUE);
SELECT tuticket.crear_evento('Festival Gastronómico Piura', 'Plaza de Armas, Piura', 4, 4, 24, 'SOL'::tipoMoneda, 6, 'Comida peruana', 'Duración 5h', 'No mascotas', 'https://tuticket-bucket.s3.us-east-1.amazonaws.com/festival_gastronomico_piura.jpg', 'maps/festival.png', TRUE);
SELECT tuticket.crear_evento('Conferencia Tech Trujillo', 'Av. Larco 1010, Trujillo', 5, 5, 25, 'DOLAR'::tipoMoneda, 5, 'Startups 2026', 'Duración 3h', 'Ingreso con ID', 'https://tuticket-bucket.s3.us-east-1.amazonaws.com/conferencia_tech_trujillo.jpg', 'maps/confe.png', TRUE);
SELECT tuticket.crear_evento('Estreno de Cine Tacna', 'Mall Tacna, Tacna', 6, 6, 26, 'SOL'::tipoMoneda, 10, 'Película esperada', 'Duración 2h', 'No grabaciones', 'https://tuticket-bucket.s3.us-east-1.amazonaws.com/estreno_de_cine_tacna.jpeg', 'maps/cine.png', TRUE);
SELECT tuticket.crear_evento('Expo Arte Iquitos', 'Malecón Tarapacá, Iquitos', 7, 7, 27, 'SOL'::tipoMoneda, 8, 'Pinturas modernas', 'Duración 4h', 'No flash', 'https://tuticket-bucket.s3.us-east-1.amazonaws.com/expo_arte_iquitos.jpeg', 'maps/expo.png', TRUE);
SELECT tuticket.crear_evento('Feria Escolar Huancayo', 'Parque Huamanmarca, Huancayo', 8, 8, 28, 'SOL'::tipoMoneda, 10, 'Feria anual', 'Duración 1 día', 'Ingreso libre', 'https://tuticket-bucket.s3.us-east-1.amazonaws.com/imagen_2025-10-31_025834910.png', 'maps/feria.png', TRUE);
SELECT tuticket.crear_evento('Procesión Ayacucho', 'Centro Histórico, Ayacucho', 9, 9, 29, 'SOL'::tipoMoneda, 4, 'Fiesta patronal', 'Duración 6h', 'Ropa adecuada', 'https://tuticket-bucket.s3.us-east-1.amazonaws.com/procesion_huancayo.jpg', 'maps/procesion.png', TRUE);
SELECT tuticket.crear_evento('Encuentro Cultural Puno', 'Plaza de Armas, Puno', 10, 10, 30, 'SOL'::tipoMoneda, 6, 'Danzas andinas', 'Duración 4h', 'Ingreso ordenado', 'https://tuticket-bucket.s3.us-east-1.amazonaws.com/encuentro_cultural_puno.jpeg', 'maps/cultural.png', TRUE);

-- =====================
-- 9) ZONAS: 2 por evento (20 zonas)
--    zone_id = (event-1)*2 + 1  y +2
-- =====================
-- Evento 1
SELECT tuticket.crear_zona('E1 - VIP', 500, 1, TRUE);       -- zona 1
SELECT tuticket.crear_zona('E1 - General', 5000, 1, TRUE);  -- zona 2
-- Evento 2
SELECT tuticket.crear_zona('E2 - Preferencial', 1500, 2, TRUE); -- zona 3
SELECT tuticket.crear_zona('E2 - Balcón', 800, 2, TRUE);        -- zona 4
-- Evento 3
SELECT tuticket.crear_zona('E3 - Norte', 7000, 3, TRUE);    -- zona 5
SELECT tuticket.crear_zona('E3 - Sur', 7000, 3, TRUE);      -- zona 6
-- Evento 4
SELECT tuticket.crear_zona('E4 - Zona Gastronómica', 1000, 4, TRUE); -- zona 7
SELECT tuticket.crear_zona('E4 - Patio', 2000, 4, TRUE);            -- zona 8
-- Evento 5
SELECT tuticket.crear_zona('E5 - Auditorio Principal', 800, 5, TRUE); -- zona 9
SELECT tuticket.crear_zona('E5 - Galería', 400, 5, TRUE);            -- zona 10
-- Evento 6
SELECT tuticket.crear_zona('E6 - Sala 1', 200, 6, TRUE); -- zona 11
SELECT tuticket.crear_zona('E6 - Sala 2', 200, 6, TRUE); -- zona 12
-- Evento 7
SELECT tuticket.crear_zona('E7 - Sala Arte', 400, 7, TRUE);  -- zona 13
SELECT tuticket.crear_zona('E7 - Patio Arte', 600, 7, TRUE); -- zona 14
-- Evento 8
SELECT tuticket.crear_zona('E8 - Campo Libre', 10000, 8, TRUE); -- zona 15
SELECT tuticket.crear_zona('E8 - VIP Campo', 1000, 8, TRUE);    -- zona 16
-- Evento 9
SELECT tuticket.crear_zona('E9 - Plaza Principal', 5000, 9, TRUE); -- zona 17
SELECT tuticket.crear_zona('E9 - Tribuna', 2000, 9, TRUE);        -- zona 18
-- Evento 10
SELECT tuticket.crear_zona('E10 - Escenario', 2000, 10, TRUE); -- zona 19
SELECT tuticket.crear_zona('E10 - Público', 3000, 10, TRUE);   -- zona 20

-- =====================
-- 10) TIPOS DE ENTRADA
--   - Eventos 1..7: 2 tipos cada uno (Adulto, Niño/Conadis según el caso)
--   - Eventos 8..10: 1 tipo 'Acceso General'
--   tipoentrada_id mapping:
--     E1 -> ids 1,2
--     E2 -> ids 3,4
--     ...
--     E7 -> ids 13,14
--     E8 -> 15, E9 -> 16, E10 -> 17
-- =====================
-- Evento 1
SELECT tuticket.crear_tipoentrada('Adulto', 1, 'Entrada general para Concierto Rock', TRUE);   -- id 1
SELECT tuticket.crear_tipoentrada('Conadis', 1, 'Entrada Conadis para Concierto Rock', TRUE);   -- id 2
-- Evento 2
SELECT tuticket.crear_tipoentrada('Adulto', 2, 'Platea para Teatro Clásico', TRUE);             -- id 3
SELECT tuticket.crear_tipoentrada('Niño', 2, 'Balcón para Teatro Clásico', TRUE);               -- id 4
-- Evento 3
SELECT tuticket.crear_tipoentrada('Adulto', 3, 'Tribuna para Partido Cusco', TRUE);             -- id 5
SELECT tuticket.crear_tipoentrada('Acceso General', 3, 'Acceso Tribuna', TRUE);                 -- id 6
-- Evento 4
SELECT tuticket.crear_tipoentrada('Adulto', 4, 'Acceso Gastronómico', TRUE);                    -- id 7
SELECT tuticket.crear_tipoentrada('Niño', 4, 'Acceso Niños', TRUE);                             -- id 8
-- Evento 5
SELECT tuticket.crear_tipoentrada('Acceso General', 5, 'Asistente Conferencia Tech', TRUE);     -- id 9
SELECT tuticket.crear_tipoentrada('Estudiante', 5, 'Descuento Estudiante', TRUE);               -- id 10
-- Evento 6
SELECT tuticket.crear_tipoentrada('Adulto', 6, 'Entrada Cine', TRUE);                           -- id 11
SELECT tuticket.crear_tipoentrada('Acceso General', 6, 'Entrada Simple', TRUE);                 -- id 12
-- Evento 7
SELECT tuticket.crear_tipoentrada('Adulto', 7, 'Visitante Expo Arte', TRUE);                    -- id 13
SELECT tuticket.crear_tipoentrada('Niño', 7, 'Entrada Niño Expo', TRUE);                        -- id 14
-- Evento 8
SELECT tuticket.crear_tipoentrada('Acceso General', 8, 'Acceso Feria Escolar', TRUE);           -- id 15
-- Evento 9
SELECT tuticket.crear_tipoentrada('Acceso General', 9, 'Acceso Procesión', TRUE);               -- id 16
-- Evento 10
SELECT tuticket.crear_tipoentrada('General', 10, 'Acceso Encuentro Cultural', TRUE);            -- id 17

-- =====================
-- 11) PERIODOS (2 por evento para 1..7, 1 para 8..10)
--     period_id mapping:
--       E1 -> 1,2
--       E2 -> 3,4
--       ...
--       E7 -> 13,14
--       E8 -> 15, E9 -> 16, E10 -> 17
-- =====================
-- Evento 1 (pasado)
SELECT tuticket.crear_periodo('Preventa Rock', '2025-01-01', '2025-01-09', 'PORCENTAJE'::tipoDescuento, 10.00, 1, TRUE); -- id 1
SELECT tuticket.crear_periodo('Normal Rock', '2025-01-10', '2025-01-11', NULL::tipoDescuento, 0.00, 1, TRUE);               -- id 2

-- Evento 2
SELECT tuticket.crear_periodo('Temporada Teatro - Preventa', '2025-10-01', '2025-12-31', 'PORCENTAJE'::tipoDescuento, 5.00, 2, TRUE); -- id 3
SELECT tuticket.crear_periodo('Temporada Teatro - Regular', '2026-01-01', '2025-02-05', NULL::tipoDescuento, 0.00, 2, TRUE);         -- id 4

-- Evento 3 (deportivo, show en 2026)
SELECT tuticket.crear_periodo('Apertura Cusco - Preventa', '2025-10-01', '2026-01-15', 'PORCENTAJE'::tipoDescuento, 8.00, 3, TRUE); -- id 5
SELECT tuticket.crear_periodo('Apertura Cusco - Regular', '2026-01-16', '2026-02-28', NULL::tipoDescuento, 0.00, 3, TRUE);         -- id 6

-- Evento 4 (próximo dentro de 2026)
SELECT tuticket.crear_periodo('Previa Gastro - Preventa', '2025-10-10', '2026-01-04', 'PORCENTAJE'::tipoDescuento, 12.00, 4, TRUE); -- id 7
SELECT tuticket.crear_periodo('Previa Gastro - Evento', '2026-01-05', '2026-01-06', NULL::tipoDescuento, 0.00, 4, TRUE);           -- id 8

-- Evento 5 (conferencia 2026)
SELECT tuticket.crear_periodo('Tech Week - Early', '2025-10-20', '2026-01-09', 'MONTO'::tipoDescuento, 15.00, 5, TRUE); -- id 9
SELECT tuticket.crear_periodo('Tech Week - Regular', '2026-01-10', '2026-01-11', NULL::tipoDescuento, 0.00, 5, TRUE);     -- id 10

-- Evento 6 (cine)
SELECT tuticket.crear_periodo('Estreno Cine - Preventa', '2025-10-20', '2026-01-04', 'MONTO'::tipoDescuento, 2.50, 6, TRUE); -- id 11
SELECT tuticket.crear_periodo('Estreno Cine - Sala', '2026-01-05', '2026-01-10', NULL::tipoDescuento, 0.00, 6, TRUE);      -- id 12

-- Evento 7 (expo extensa)
SELECT tuticket.crear_periodo('Expo Iquitos - Preventa', '2025-10-01', '2026-02-10', 'PORCENTAJE'::tipoDescuento, 9.00, 7, TRUE); -- id 13
SELECT tuticket.crear_periodo('Expo Iquitos - Regular', '2026-02-11', '2026-03-31', NULL::tipoDescuento, 0.00, 7, TRUE);          -- id 14

-- Evento 8,9,10 (una temporada cada uno)
SELECT tuticket.crear_periodo('Feria Escolar', '2025-10-15', '2025-10-27', 'MONTO'::tipoDescuento, 3.00, 8, TRUE); -- id 15
SELECT tuticket.crear_periodo('Patronal Ayacucho', '2025-10-20', '2025-11-10', 'PORCENTAJE'::tipoDescuento, 5.00, 9, TRUE); -- id 16
SELECT tuticket.crear_periodo('Cultural Puno', '2025-11-15', '2025-11-30', 'PORCENTAJE'::tipoDescuento, 6.00, 10, TRUE); -- id 17


-- =====================
-- 12) FUNCIONES
--   - Eventos 1..7: 2 funciones cada uno (1..14)
--   - Eventos 8..10: 1 función cada uno (15..17)
--   * Evento 1 funciones en 2025 (pasado)
--   * Eventos 2..7 funciones principales en 2026 (futuros)
-- =====================
-- Evento 1 (pasado)
SELECT tuticket.crear_funcion(1, '2025-01-10 20:00:00', '2025-01-10 23:00:00', TRUE); -- func 1
SELECT tuticket.crear_funcion(1, '2025-01-11 20:00:00', '2025-01-11 23:00:00', TRUE); -- func 2

-- Evento 2 (teatro, funciones en 2026)
SELECT tuticket.crear_funcion(2, '2026-02-05 19:00:00', '2026-02-05 21:00:00', TRUE); -- func 3
SELECT tuticket.crear_funcion(2, '2026-02-06 19:00:00', '2026-02-06 21:00:00', TRUE); -- func 4

-- Evento 3 (deporte 2026)
SELECT tuticket.crear_funcion(3, '2026-01-22 15:00:00', '2026-01-22 17:00:00', TRUE); -- func 5
SELECT tuticket.crear_funcion(3, '2026-01-23 15:00:00', '2026-01-23 17:00:00', TRUE); -- func 6

-- Evento 4 (Gastronómico) -> PRÓXIMO (cercano en 2026)
SELECT tuticket.crear_funcion(4, '2026-01-05 10:00:00', '2026-01-05 15:00:00', TRUE); -- func 7  (próximo)
SELECT tuticket.crear_funcion(4, '2026-01-06 10:00:00', '2026-01-06 15:00:00', TRUE); -- func 8

-- Evento 5 (Conferencia 2026)
SELECT tuticket.crear_funcion(5, '2026-01-10 09:00:00', '2026-01-10 12:00:00', TRUE); -- func 9
SELECT tuticket.crear_funcion(5, '2026-01-11 09:00:00', '2026-01-11 12:00:00', TRUE); -- func 10

-- Evento 6 (Cine 2026)
SELECT tuticket.crear_funcion(6, '2026-01-15 18:00:00', '2026-01-15 20:00:00', TRUE); -- func 11
SELECT tuticket.crear_funcion(6, '2026-01-16 18:00:00', '2026-01-16 20:00:00', TRUE); -- func 12

-- Evento 7 (Expo 2026)
SELECT tuticket.crear_funcion(7, '2026-02-20 14:00:00', '2026-02-20 17:00:00', TRUE); -- func 13
SELECT tuticket.crear_funcion(7, '2026-02-21 14:00:00', '2026-02-21 17:00:00', TRUE); -- func 14

-- Evento 8,9,10 (fechas en 2025 como ya estaban/ejemplo)
SELECT tuticket.crear_funcion(8, '2025-10-28 16:00:00', '2025-10-28 18:00:00', TRUE); -- func 15
SELECT tuticket.crear_funcion(9, '2025-11-16 12:00:00', '2025-11-16 14:00:00', TRUE); -- func 16
SELECT tuticket.crear_funcion(10, '2025-12-05 18:00:00', '2025-12-05 22:00:00', TRUE); -- func 17

--======================
-- 12.5) zona_funcion
--=====================
SELECT tuticket.crear_funcion_zona(1,1); --Evento concierto rock
SELECT tuticket.crear_funcion_zona(1,2);
SELECT tuticket.crear_funcion_zona(2,1);
SELECT tuticket.crear_funcion_zona(2,2);

SELECT tuticket.crear_funcion_zona(3,3); --Evento Teatro Arequipa
SELECT tuticket.crear_funcion_zona(4,4, 798);
SELECT tuticket.crear_funcion_zona(4,3);
SELECT tuticket.crear_funcion_zona(3,4, 1500);

SELECT tuticket.crear_funcion_zona(5,5); -- Partido Cusco
SELECT tuticket.crear_funcion_zona(6,6);
SELECT tuticket.crear_funcion_zona(6,5);
SELECT tuticket.crear_funcion_zona(5,6);

SELECT tuticket.crear_funcion_zona(7,7);-- Festival gastronómico Piura
SELECT tuticket.crear_funcion_zona(8,8);
SELECT tuticket.crear_funcion_zona(8,7);
SELECT tuticket.crear_funcion_zona(7,8);

SELECT tuticket.crear_funcion_zona(9,9); -- Conferencia Tech
SELECT tuticket.crear_funcion_zona(10,10);
SELECT tuticket.crear_funcion_zona(10,9);
SELECT tuticket.crear_funcion_zona(9,10);

SELECT tuticket.crear_funcion_zona(11,11); -- Estreno de cine tacna
SELECT tuticket.crear_funcion_zona(12,12);
SELECT tuticket.crear_funcion_zona(12,11);
SELECT tuticket.crear_funcion_zona(11,12);

SELECT tuticket.crear_funcion_zona(13,13);-- Expo arte
SELECT tuticket.crear_funcion_zona(14,14);
SELECT tuticket.crear_funcion_zona(14,13);
SELECT tuticket.crear_funcion_zona(13,14);

SELECT tuticket.crear_funcion_zona(15,15);-- Feria Escolar Huancayo
SELECT tuticket.crear_funcion_zona(16,15);

SELECT tuticket.crear_funcion_zona(17,16); -- Procesión Ayacucho
SELECT tuticket.crear_funcion_zona(18,16);

SELECT tuticket.crear_funcion_zona(19,17); -- Encuentro Cultural Puno
SELECT tuticket.crear_funcion_zona(20,17);
-- =====================
-- 13) TARIFAS
--    Creamos 1 tarifa por zona, usando el tipo de entrada apropiado por evento
--    tarifa_id = zona_id (porque insertamos en el mismo orden)
-- =====================
-- Evento 1 -> zonas 1,2  tipoEntrada 1,2
SELECT tuticket.crear_tarifa(150.00, 1, 1, TRUE); -- tarifa 1 (E1 VIP Adulto)
SELECT tuticket.crear_tarifa(50.00, 2, 2, TRUE);  -- tarifa 2 (E1 General Conadis)

-- Evento 2 -> zonas 3,4 tipoEntrada 3,4
SELECT tuticket.crear_tarifa(100.00, 3, 3, TRUE); -- tarifa 3
SELECT tuticket.crear_tarifa(80.00, 4, 4, TRUE);  -- tarifa 4

-- Evento 3 -> zonas 5,6 tipoEntrada 5,6
SELECT tuticket.crear_tarifa(70.00, 5, 5, TRUE);  -- tarifa 5
SELECT tuticket.crear_tarifa(70.00, 6, 6, TRUE);  -- tarifa 6

-- Evento 4 -> zonas 7,8 tipoEntrada 7,8
SELECT tuticket.crear_tarifa(40.00, 7, 7, TRUE);  -- tarifa 7
SELECT tuticket.crear_tarifa(60.00, 8, 8, TRUE);  -- tarifa 8

-- Evento 5 -> zonas 9,10 tipoEntrada 9,10
SELECT tuticket.crear_tarifa(130.00, 9, 9, TRUE); -- tarifa 9
SELECT tuticket.crear_tarifa(80.00, 10, 10, TRUE); -- tarifa 10

-- Evento 6 -> zonas 11,12 tipoEntrada 11,12
SELECT tuticket.crear_tarifa(30.00, 11, 11, TRUE); -- tarifa 11
SELECT tuticket.crear_tarifa(28.00, 12, 12, TRUE); -- tarifa 12

-- Evento 7 -> zonas 13,14 tipoEntrada 13,14
SELECT tuticket.crear_tarifa(25.00, 13, 13, TRUE); -- tarifa 13
SELECT tuticket.crear_tarifa(20.00, 14, 14, TRUE); -- tarifa 14

-- Evento 8 -> zonas 15,16 tipoEntrada 15
SELECT tuticket.crear_tarifa(20.00, 15, 15, TRUE); -- tarifa 15
SELECT tuticket.crear_tarifa(35.00, 16, 15, TRUE); -- tarifa 16 (VIP Feria -> mismo tipo 'Acceso General')

-- Evento 9 -> zonas 17,18 tipoEntrada 16
SELECT tuticket.crear_tarifa(15.00, 17, 16, TRUE); -- tarifa 17
SELECT tuticket.crear_tarifa(12.00, 18, 16, TRUE); -- tarifa 18

-- Evento 10 -> zonas 19,20 tipoEntrada 17
SELECT tuticket.crear_tarifa(40.00, 19, 17, TRUE); -- tarifa 19
SELECT tuticket.crear_tarifa(25.00, 20, 17, TRUE); -- tarifa 20

-- =====================
-- 14) ÓRDENES DE COMPRA (12 ejemplos)
--    idOrdenCompra se asigna en orden (1..12)
--    Primeras órdenes para evento 1 (pasado), resto a funciones 2026 (futuro)
-- =====================
SELECT tuticket.crear_ordencompra(1, 1, 'TARJETA', 'ACEPTADA'::estadoOrdenCompra, 150.00, 0.00, 150.00);
SELECT tuticket.crear_ordencompra(2, 2, 'TARJETA', 'ACEPTADA'::estadoOrdenCompra, 220.00, 20.00, 200.00);
SELECT tuticket.crear_ordencompra(3, 3, 'EFECTIVO', 'PENDIENTE'::estadoOrdenCompra, 90.00, 0.00, 90.00);
SELECT tuticket.crear_ordencompra(4, 7, 'TARJETA', 'ACEPTADA'::estadoOrdenCompra, 300.00, 30.00, 270.00);
SELECT tuticket.crear_ordencompra(5, 8, 'TARJETA', 'ACEPTADA'::estadoOrdenCompra, 120.00, 0.00, 120.00);
SELECT tuticket.crear_ordencompra(6, 9, 'PAYPAL', 'CANCELADA'::estadoOrdenCompra, 180.00, 10.00, 170.00);
SELECT tuticket.crear_ordencompra(7, 11, 'EFECTIVO', 'ACEPTADA'::estadoOrdenCompra, 75.00, 0.00, 75.00);
SELECT tuticket.crear_ordencompra(8, 13, 'TARJETA', 'ACEPTADA'::estadoOrdenCompra, 410.00, 50.00, 360.00);
SELECT tuticket.crear_ordencompra(9, 15, 'TARJETA', 'ACEPTADA'::estadoOrdenCompra, 200.00, 0.00, 200.00);
SELECT tuticket.crear_ordencompra(10, 16, 'PAYU', 'PENDIENTE'::estadoOrdenCompra, 135.00, 5.00, 130.00);
SELECT tuticket.crear_ordencompra(11, 5, 'TARJETA', 'ACEPTADA'::estadoOrdenCompra, 160.00, 0.00, 160.00);
SELECT tuticket.crear_ordencompra(12, 6, 'TARJETA', 'ACEPTADA'::estadoOrdenCompra, 160.00, 15.00, 145.00);

-- =====================
-- 15) DETALLE_COMPRA (12) - 1 detalle por orden (cantidad = 1 para simplicidad)
--    p_idOrdenCompra, p_idTarifa, p_idPeriodo, p_cantidad, p_precioDetalle
--    Aseguramos que tarifa y periodo correspondan al mismo evento
-- =====================
-- Orden 1 -> evento1 -> tarifa 1, periodo 1
SELECT tuticket.crear_detallecompra(1, 1, 1, 1, 150.00); -- detalle 1

-- Orden 2 -> evento1 -> tarifa 2, periodo 1
SELECT tuticket.crear_detallecompra(2, 2, 1, 1, 50.00);  -- detalle 2

-- Orden 3 -> evento2 -> tarifa 3, periodo 3
SELECT tuticket.crear_detallecompra(3, 3, 3, 2, 95.00);  -- detalle 3 (cantidad 2 ejemplo)

-- Orden 4 -> evento4 -> tarifa 7, periodo 7 (preventa -> aplica 12% off)
-- Aquí precioDetalle ya puede reflejar descuento: tarifa 40 - 12% = 35.20
SELECT tuticket.crear_detallecompra(4, 7, 7, 1, 35.20); -- detalle 4

-- Orden 5 -> evento4 -> tarifa 8, periodo 8 (evento día)
SELECT tuticket.crear_detallecompra(5, 8, 8, 1, 60.00); -- detalle 5

-- Orden 6 -> evento5 -> tarifa 9, periodo 9 (preventa con monto fijo 15)
-- Si tipo MONTO: 130 - 15 = 115.00
SELECT tuticket.crear_detallecompra(6, 9, 9, 3, 115.00); -- detalle 6 (cantidad 3 ejemplo)

-- Orden 7 -> evento6 -> tarifa 11, periodo 11
SELECT tuticket.crear_detallecompra(7, 11, 11, 2, 27.50); -- detalle 7 (ej: 30-2.5)

-- Orden 8 -> evento7 -> tarifa 13, periodo 13
SELECT tuticket.crear_detallecompra(8, 13, 13, 1, 25.00); -- detalle 8

-- Orden 9 -> evento8 -> tarifa 15, periodo 15
SELECT tuticket.crear_detallecompra(9, 15, 15, 2, 17.00); -- detalle 9 (ej 20-3=17)

-- Orden 10 -> evento9 -> tarifa 17, periodo 16
SELECT tuticket.crear_detallecompra(10, 17, 16, 1, 15.00); -- detalle 10

-- Orden 11 -> evento3 -> tarifa 5, periodo 5
SELECT tuticket.crear_detallecompra(11, 5, 5, 1, 70.00); -- detalle 11

-- Orden 12 -> evento3 -> tarifa 6, periodo 6
SELECT tuticket.crear_detallecompra(12, 6, 6, 1, 70.00); -- detalle 12

-- =====================
-- 16) TICKETS
--   Creamos 1 ticket por detalle; para los detalles con cantidad >1 podrías crear más tickets apuntando al mismo idDetalleCompra
-- =====================
SELECT tuticket.crear_ticket(1,  'HASH-T1-A001', 150.00, TRUE);  -- ticket 1 (evento1 pasado, usado TRUE)
SELECT tuticket.crear_ticket(2,  'HASH-T1-B001', 50.00, TRUE);   -- ticket 2 (evento1 pasado)
SELECT tuticket.crear_ticket(3,  'HASH-T2-C001', 95.00, FALSE);  -- ticket 3 (evento2 2026, futuro)
-- detalle 3 tenía cantidad 2 -> creamos un segundo ticket apuntando al mismo detalle (ejemplo)
SELECT tuticket.crear_ticket(3,  'HASH-T2-C002', 95.00, FALSE);  -- ticket 4
SELECT tuticket.crear_ticket(4,  'HASH-T4-D001', 35.20, FALSE);  -- ticket 5 (evento4 próximo)
SELECT tuticket.crear_ticket(5,  'HASH-T5-E001', 60.00, FALSE);  -- ticket 6
SELECT tuticket.crear_ticket(6,  'HASH-T6-F001', 115.00, FALSE); -- ticket 7 (cantidad 3 -> se creó 1 ejemplo)
SELECT tuticket.crear_ticket(7,  'HASH-T7-G001', 27.50, FALSE);  -- ticket 8
SELECT tuticket.crear_ticket(8,  'HASH-T8-H001', 25.00, FALSE);  -- ticket 9
SELECT tuticket.crear_ticket(9,  'HASH-T9-I001', 17.00, FALSE);  -- ticket 10
SELECT tuticket.crear_ticket(10, 'HASH-T10-J001', 15.00, FALSE);  -- ticket 11
SELECT tuticket.crear_ticket(11, 'HASH-T11-K001', 70.00, FALSE);  -- ticket 12
SELECT tuticket.crear_ticket(12, 'HASH-T12-L001', 70.00, FALSE);  -- ticket 13

-- =====================
-- 17) DEVOLUCIONES (ejemplos)
-- =====================
SELECT tuticket.crear_devolucion(10.00, 1);  -- devolución sobre ticket 1 (pasado)
SELECT tuticket.crear_devolucion(5.00, 2);   -- ticket 2
SELECT tuticket.crear_devolucion(3.00, 10);  -- ticket 10 (futuro permitido)
SELECT tuticket.crear_devolucion(100.00, 11); -- ejemplo (ticket 11, futuro/conferencia)

-- =====================
-- 18) Descuentos (ejemplos)
-- =====================
SELECT tuticket.crear_descuento('GLOBAL10', 'PORCENTAJE'::tipoDescuento, 10.00, '2025-01-01', '2025-12-31', 1000, NULL, TRUE, TRUE, NULL);
SELECT tuticket.crear_descuento('ROCK5', 'MONTO'::tipoDescuento, 5.00, '2025-01-01', '2025-02-15', 300, 2, FALSE, TRUE, 1);
SELECT tuticket.crear_descuento('TEATRO15', 'PORCENTAJE'::tipoDescuento, 15.00, '2025-03-01', '2025-03-31', 200, 2, FALSE, TRUE, 2);
SELECT tuticket.crear_descuento('CUSCO7', 'MONTO'::tipoDescuento, 7.00, '2025-04-01', '2025-04-30', 150, 1, FALSE, TRUE, 3);
SELECT tuticket.crear_descuento('GASTRO12', 'PORCENTAJE'::tipoDescuento, 12.00, '2025-05-01', '2025-05-31', 250, 3, FALSE, TRUE, 4);
SELECT tuticket.crear_descuento('TECH20', 'PORCENTAJE'::tipoDescuento, 20.00, '2025-06-01', '2025-06-30', 100, 1, FALSE, TRUE, 5);
SELECT tuticket.crear_descuento('CINE3', 'MONTO'::tipoDescuento, 3.00, '2025-06-15', '2025-07-15', 500, NULL, FALSE, TRUE, 6);
SELECT tuticket.crear_descuento('EXPO10', 'PORCENTAJE'::tipoDescuento, 10.00, '2025-07-01', '2025-07-31', 180, 2, FALSE, TRUE, 7);
SELECT tuticket.crear_descuento('FERIA5', 'MONTO'::tipoDescuento, 5.00, '2025-08-01', '2025-08-31', 220, 4, FALSE, TRUE, 8);
SELECT tuticket.crear_descuento('PATRONAL8', 'PORCENTAJE'::tipoDescuento, 8.00, '2025-09-01', '2025-09-30', 160, 2, FALSE, TRUE, 9);
-- FIN DEL DML
