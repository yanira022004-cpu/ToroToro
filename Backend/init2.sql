-- =====================
-- EXTENSIONES
-- =====================
CREATE EXTENSION IF NOT EXISTS postgis;

-- =====================
-- TIPOS ENUMERADOS
-- =====================
CREATE TYPE TipoAtractivo AS ENUM ('MIRADOR', 'CANON', 'CASCADA', 'FOSIL', 'CAVERNA');
CREATE TYPE EstadoAtractivoTuristico AS ENUM ('RIESGO', 'DETERIORADO', 'BUENO');
CREATE TYPE NivelTipoRiesgo AS ENUM ('BAJO', 'MEDIO', 'ALTO');
CREATE TYPE TipoRutaRutasAcceso AS ENUM ('CAMINO', 'CARRETERA', 'SENDERISMO');
CREATE TYPE NombreCategoria AS ENUM ('TURISTICO', 'GEOLOGICO', 'RECREATIVO', 'CULTURAL', 'PALEONTOLOGICO', 'ARQUEOLOGICO', 'ECOLOGICO', 'AVENTURA');
CREATE TYPE NombreServicios AS ENUM ('CAFETERIA', 'HOTEL', 'RESTAURANTE', 'TRANSPORTE', 'GUIA_TURISTICO', 'CENTRO_DE_SALUD');
CREATE TYPE MedioTransporte AS ENUM ('PRIVADO', 'COMPARTIDO');

-- =====================
-- TABLAS
-- =====================
CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria NombreCategoria NOT NULL,
    descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE tipo_riesgo (
    id_tipo_riesgo SERIAL PRIMARY KEY,
    nivel NivelTipoRiesgo NOT NULL DEFAULT 'MEDIO',
    descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE atractivo_turistico (
    id_atrac_turist SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo_atractivo TipoAtractivo NOT NULL,
    estado EstadoAtractivoTuristico NOT NULL DEFAULT 'BUENO',
    tiempo_visita INTEGER NOT NULL,
    elevacion DECIMAL(6,2) NOT NULL,
    longitud DECIMAL(9,6) NOT NULL,
    latitud DECIMAL(9,6) NOT NULL,
    este DECIMAL(10,2) NOT NULL,
    norte DECIMAL(10,2) NOT NULL,
    tipo_riesgo_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    geom geometry(Point, 4326),
    CONSTRAINT fk_tipo_riesgo FOREIGN KEY (tipo_riesgo_id) REFERENCES tipo_riesgo(id_tipo_riesgo),
    CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id_categoria)
);

CREATE TABLE rutas_acceso (
    id_rutas_acceso SERIAL PRIMARY KEY,
    tipo_ruta TipoRutaRutasAcceso NOT NULL,
    tiempo_est INTERVAL NOT NULL,
    distancia_km DECIMAL(6,2) NOT NULL,
    condicion_ruta VARCHAR(50) NOT NULL,
    medio_transp MedioTransporte NOT NULL
);

CREATE TABLE rutas_acceso_has_atractivo_turistico (
    rutas_acceso_id INTEGER NOT NULL,
    atractivo_turistico_id INTEGER NOT NULL,
    PRIMARY KEY (rutas_acceso_id, atractivo_turistico_id),
    CONSTRAINT fk_rutas FOREIGN KEY (rutas_acceso_id) REFERENCES rutas_acceso(id_rutas_acceso),
    CONSTRAINT fk_atractivo FOREIGN KEY (atractivo_turistico_id) REFERENCES atractivo_turistico(id_atrac_turist)
);

CREATE TABLE area_prot (
    id_area_prot SERIAL PRIMARY KEY,
    area geometry(POLYGON, 4326) NOT NULL,
    perimetro geometry(LINESTRING, 4326) NOT NULL,
    descripcion VARCHAR(150) NOT NULL,
    atractivo_turistico_id INTEGER NOT NULL,
    CONSTRAINT fk_area_atractivo FOREIGN KEY (atractivo_turistico_id) REFERENCES atractivo_turistico(id_atrac_turist)
);

CREATE TABLE servicios (
    id_servicio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo_servicio NombreServicios NOT NULL DEFAULT 'HOTEL',
    costo INTEGER NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    calificacion DECIMAL(2,1) NOT NULL,
    longitud DECIMAL(9,6) NOT NULL,
    latitud DECIMAL(9,6) NOT NULL,
    atractivo_turistico_id INTEGER NOT NULL,
    geom geometry(Point, 4326),
    CONSTRAINT fk_servicio_atractivo FOREIGN KEY (atractivo_turistico_id) REFERENCES atractivo_turistico(id_atrac_turist)
);

-- =====================
-- INSERCIÓN DE DATOS COMPLETOS SIN NULLs
-- =====================

-- CATEGORÍAS
INSERT INTO categoria (nombre_categoria, descripcion) VALUES
('GEOLOGICO', 'Formaciones rocosas, cavernas y estructuras geológicas únicas'),
('RECREATIVO', 'Paisajes naturales para recreación y esparcimiento'),
('CULTURAL', 'Atractivos con valor histórico y cultural ancestral'),
('PALEONTOLOGICO', 'Sitios con fósiles y huellas de dinosaurios'),
('ARQUEOLOGICO', 'Vestigios arqueológicos y pinturas rupestres'),
('ECOLOGICO', 'Áreas con biodiversidad y ecosistemas preservados'),
('AVENTURA', 'Atractivos para deportes de aventura y trekking'),
('TURISTICO', 'Sitios de interés turístico general');

-- TIPOS DE RIESGO
INSERT INTO tipo_riesgo (nivel, descripcion) VALUES
('BAJO', 'Acceso fácil y seguro para toda la familia'),
('MEDIO', 'Terreno irregular con pendientes moderadas'),
('ALTO', 'Requiere equipo especial y guía experto'),
('BAJO', 'Sendero bien marcado y condiciones estables'),
('MEDIO', 'Terreno rocoso con algunas dificultades'),
('ALTO', 'Precipicios y zonas de desprendimiento rocoso');
 
-- =====================
-- INSERCIÓN DE ATRACTIVOS TURÍSTICOS DE TOROTORO
-- =====================
INSERT INTO atractivo_turistico (nombre, tipo_atractivo, estado, tiempo_visita, elevacion, longitud, latitud, este, norte, tipo_riesgo_id, categoria_id, geom) VALUES
-- 1. Caverna de Umajalanta
('Caverna de Umajalanta', 'CAVERNA', 'BUENO', 180, 2850.00, -65.811413, -18.114516, 202472.22, 7994873.86, 3, 1, ST_SetSRID(ST_MakePoint(-65.811413, -18.114516), 4326)),
-- 3. Caverna de P'isqu Waek'atana (asumiendo por coordenadas)
('Caverna de P''isqu Waek''atana', 'CAVERNA', 'BUENO', 120, 2660.00, -65.807802, -18.119416, 202862.85, 7994337.05, 3, 1, ST_SetSRID(ST_MakePoint(-65.807802, -18.119416), 4326)),
-- 4 y 5. Cascada El Vergel
('Cascada El Vergel', 'CASCADA', 'BUENO', 90, 2456.00, -65.774025, -18.111429, 206426.25, 7995275.80, 2, 2, ST_SetSRID(ST_MakePoint(-65.774025, -18.111429), 4326)),
-- 6. Cañón de ToroToro
('Cañón de ToroToro', 'CANON', 'BUENO', 120, 2676.00, -65.771833, -18.109312, 206654.92, 7995513.76, 3, 7, ST_SetSRID(ST_MakePoint(-65.771833, -18.109312), 4326)),
-- 7. Cerro de Huayllas
('Cerro de Huayllas', 'MIRADOR', 'BUENO', 60, 2760.00, -66.883333, -17.733333, 724452.13, 8038053.82, 4, 4, ST_SetSRID(ST_MakePoint(-66.883333, -17.733333), 4326)),
-- 9. Puente de los Enamorados
('Puente de los Enamorados', 'MIRADOR', 'BUENO', 30, 2700.00, -65.768327, -18.114035, 207034.02, 7994996.35, 1, 8, ST_SetSRID(ST_MakePoint(-65.768327, -18.114035), 4326)),
-- 10. Puente de Piedra (asumiendo mirador)
('Puente de Piedra', 'MIRADOR', 'BUENO', 25, 2682.00, -65.770741, -18.109832, 206771.35, 7995457.91, 1, 1, ST_SetSRID(ST_MakePoint(-65.770741, -18.109832), 4326)),
-- 11. Mirador del Cóndor
('Mirador del Cóndor', 'MIRADOR', 'BUENO', 45, 2720.00, -65.682629, -18.203334, 216253.11, 7985241.97, 2, 6, ST_SetSRID(ST_MakePoint(-65.682629, -18.203334), 4326)),
-- 13. Huellas de Dinosaurio
('Huellas de Dinosaurio ToroToro', 'FOSIL', 'BUENO', 60, 2650.30, -65.760791, -18.132090, 207862.00, 7993008.82, 1, 4, ST_SetSRID(ST_MakePoint(-65.760791, -18.132090), 4326)),
-- 14. Cementerio de Tortugas
('Cementerio de Tortugas', 'FOSIL', 'BUENO', 90, 2780.00, -65.749869, -18.158616, 209062.38, 7990088.67, 1, 5, ST_SetSRID(ST_MakePoint(-65.749869, -18.158616), 4326)),
-- 15. Carreras Pampa
('Carreras Pampa', 'FOSIL', 'BUENO', 120, 2740.00, -65.780088, -18.128729, 205813.11, 7993350.32, 1, 4, ST_SetSRID(ST_MakePoint(-65.780088, -18.128729), 4326)),
-- 17. Ciudad de Itas
('Ciudad de Itas', 'CANON', 'BUENO', 180, 3700.00, -65.882478, -18.105812, 194931.32, 7995721.56, 3, 1, ST_SetSRID(ST_MakePoint(-65.882478, -18.105812), 4326)),
-- 19. Cerro Llama Chaqui
('Cerro Llama Chaqui', 'MIRADOR', 'BUENO', 150, 3200.00, -65.719722, -18.137778, 212219.77, 7992443.74, 4, 7, ST_SetSRID(ST_MakePoint(-65.719722, -18.137778), 4326)),
-- 21. Pinturas Rupestres
('Pinturas Rupestres ToroToro', 'MIRADOR', 'BUENO', 75, 2900.00, -65.884708, -18.108963, 194700.62, 7995368.84, 2, 5, ST_SetSRID(ST_MakePoint(-65.884708, -18.108963), 4326)),
-- 22. Chiflon Qaqa
('Chiflon Qaqa', 'CANON', 'BUENO', 120, 2720.00, -65.773674, -18.122293, 206481.61, 7994073.30, 3, 1, ST_SetSRID(ST_MakePoint(-65.773674, -18.122293), 4326)),
-- 25. Plaza Principal ToroToro
('Plaza Principal ToroToro', 'MIRADOR', 'BUENO', 30, 2600.00, -65.762947, -18.133521, 207636.11, 7992846.89, 1, 8, ST_SetSRID(ST_MakePoint(-65.762947, -18.133521), 4326));


-- =====================
-- INSERCIÓN DE ÁREAS PROTEGIDAS
-- =====================

INSERT INTO area_prot (area, perimetro, descripcion, atractivo_turistico_id) VALUES
-- 1. Área protegida para Caverna de Umajalanta
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.812513 -18.115516, -65.810313 -18.115516, -65.810313 -18.113516, -65.812513 -18.113516, -65.812513 -18.115516))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.812513 -18.115516, -65.810313 -18.115516, -65.810313 -18.113516, -65.812513 -18.113516, -65.812513 -18.115516)'), 4326),
    'Área de protección especial para la caverna kárstica de Umajalanta con formaciones de estalactitas y estalagmitas únicas',
    1
),

-- 2. Área protegida para Caverna de P'isqu Waek'atana
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.808802 -18.120416, -65.806802 -18.120416, -65.806802 -18.118416, -65.808802 -18.118416, -65.808802 -18.120416))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.808802 -18.120416, -65.806802 -18.120416, -65.806802 -18.118416, -65.808802 -18.118416, -65.808802 -18.120416)'), 4326),
    'Zona de protección de la caverna secundaria con ecosistema subterráneo frágil',
    2
),

-- 3. Área protegida para Cascada El Vergel
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.775025 -18.112429, -65.773025 -18.112429, -65.773025 -18.110429, -65.775025 -18.110429, -65.775025 -18.112429))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.775025 -18.112429, -65.773025 -18.112429, -65.773025 -18.110429, -65.775025 -18.110429, -65.775025 -18.112429)'), 4326),
    'Área de protección del ecosistema acuático y bosque húmedo alrededor de la cascada',
    3
),

-- 4. Área protegida para Cañón de ToroToro
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.772833 -18.110312, -65.770833 -18.110312, -65.770833 -18.108312, -65.772833 -18.108312, -65.772833 -18.110312))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.772833 -18.110312, -65.770833 -18.110312, -65.770833 -18.108312, -65.772833 -18.108312, -65.772833 -18.110312)'), 4326),
    'Zona de protección del cañón con formaciones geológicas únicas y estratos sedimentarios',
    4
),

-- 5. Área protegida para Cerro de Huayllas
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-66.884333 -17.734333, -66.882333 -17.734333, -66.882333 -17.732333, -66.884333 -17.732333, -66.884333 -17.734333))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-66.884333 -17.734333, -66.882333 -17.734333, -66.882333 -17.732333, -66.884333 -17.732333, -66.884333 -17.734333)'), 4326),
    'Área protegida del cerro con yacimientos paleontológicos y vistas panorámicas',
    5
),

-- 6. Área protegida para Puente de los Enamorados
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.769327 -18.115035, -65.767327 -18.115035, -65.767327 -18.113035, -65.769327 -18.113035, -65.769327 -18.115035))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.769327 -18.115035, -65.767327 -18.115035, -65.767327 -18.113035, -65.769327 -18.113035, -65.769327 -18.115035)'), 4326),
    'Zona de protección de la formación natural del puente rocoso y su entorno',
    6
),

-- 7. Área protegida para Puente de Piedra
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.771741 -18.110832, -65.769741 -18.110832, -65.769741 -18.108832, -65.771741 -18.108832, -65.771741 -18.110832))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.771741 -18.110832, -65.769741 -18.110832, -65.769741 -18.108832, -65.771741 -18.108832, -65.771741 -18.110832)'), 4326),
    'Área de protección geológica del puente natural de piedra caliza',
    7
),

-- 8. Área protegida para Mirador del Cóndor
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.683629 -18.204334, -65.681629 -18.204334, -65.681629 -18.202334, -65.683629 -18.202334, -65.683629 -18.204334))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.683629 -18.204334, -65.681629 -18.204334, -65.681629 -18.202334, -65.683629 -18.202334, -65.683629 -18.204334)'), 4326),
    'Zona de protección del hábitat del cóndor andino y mirador natural',
    8
),

-- 9. Área protegida para Huellas de Dinosaurio
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.761791 -18.133090, -65.759791 -18.133090, -65.759791 -18.131090, -65.761791 -18.131090, -65.761791 -18.133090))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.761791 -18.133090, -65.759791 -18.133090, -65.759791 -18.131090, -65.761791 -18.131090, -65.761791 -18.133090)'), 4326),
    'Área de máxima protección paleontológica con huellas de dinosaurios del Cretácico',
    9
),

-- 10. Área protegida para Cementerio de Tortugas
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.750869 -18.159616, -65.748869 -18.159616, -65.748869 -18.157616, -65.750869 -18.157616, -65.750869 -18.159616))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.750869 -18.159616, -65.748869 -18.159616, -65.748869 -18.157616, -65.750869 -18.157616, -65.750869 -18.159616)'), 4326),
    'Zona de protección paleontológica con fósiles de tortugas prehistóricas',
    10
),

-- 11. Área protegida para Carreras Pampa
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.781088 -18.129729, -65.779088 -18.129729, -65.779088 -18.127729, -65.781088 -18.127729, -65.781088 -18.129729))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.781088 -18.129729, -65.779088 -18.129729, -65.779088 -18.127729, -65.781088 -18.127729, -65.781088 -18.129729)'), 4326),
    'Área protegida con múltiples huellas de dinosaurios en planicie sedimentaria',
    11
),

-- 12. Área protegida para Ciudad de Itas
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.883478 -18.106812, -65.881478 -18.106812, -65.881478 -18.104812, -65.883478 -18.104812, -65.883478 -18.106812))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.883478 -18.106812, -65.881478 -18.106812, -65.881478 -18.104812, -65.883478 -18.104812, -65.883478 -18.106812)'), 4326),
    'Zona de protección integral del laberinto rocoso y formaciones geológicas únicas',
    12
),

-- 13. Área protegida para Cerro Llama Chaqui
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.720722 -18.138778, -65.718722 -18.138778, -65.718722 -18.136778, -65.720722 -18.136778, -65.720722 -18.138778))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.720722 -18.138778, -65.718722 -18.138778, -65.718722 -18.136778, -65.720722 -18.136778, -65.720722 -18.138778)'), 4326),
    'Área protegida del cerro con importancia cultural y arqueológica',
    13
),

-- 14. Área protegida para Pinturas Rupestres
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.885708 -18.109963, -65.883708 -18.109963, -65.883708 -18.107963, -65.885708 -18.107963, -65.885708 -18.109963))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.885708 -18.109963, -65.883708 -18.109963, -65.883708 -18.107963, -65.885708 -18.107963, -65.885708 -18.109963)'), 4326),
    'Zona de protección arqueológica con arte rupestre precolombino',
    14
),

-- 15. Área protegida para Chiflon Qaqa
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.774674 -18.123293, -65.772674 -18.123293, -65.772674 -18.121293, -65.774674 -18.121293, -65.774674 -18.123293))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.774674 -18.123293, -65.772674 -18.123293, -65.772674 -18.121293, -65.774674 -18.121293, -65.774674 -18.123293)'), 4326),
    'Área de protección del desfiladero y formaciones erosionadas únicas',
    15
),

-- 16. Área protegida para Plaza Principal ToroToro
(
    ST_SetSRID(ST_GeomFromText('POLYGON((-65.763947 -18.134521, -65.761947 -18.134521, -65.761947 -18.132521, -65.763947 -18.132521, -65.763947 -18.134521))'), 4326),
    ST_SetSRID(ST_GeomFromText('LINESTRING(-65.763947 -18.134521, -65.761947 -18.134521, -65.761947 -18.132521, -65.763947 -18.132521, -65.763947 -18.134521)'), 4326),
    'Zona de protección del patrimonio cultural y arquitectónico del pueblo',
    16
);