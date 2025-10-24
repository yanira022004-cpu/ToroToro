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

-- ATRACTIVOS TURÍSTICOS COMPLETOS
INSERT INTO atractivo_turistico (nombre, tipo_atractivo, estado, tiempo_visita, elevacion, longitud, latitud, este, norte, tipo_riesgo_id, categoria_id, geom) VALUES
('Caverna de Umajalanta', 'CAVERNA', 'BUENO', 120, 2830.50, -65.761500, -18.133600, 618000.00, 8001360.00, 3, 1, ST_SetSRID(ST_MakePoint(-65.761500, -18.133600), 4326)),
('Mirador del Vergel', 'MIRADOR', 'BUENO', 60, 2710.00, -65.754800, -18.138400, 618500.00, 8001300.00, 2, 2, ST_SetSRID(ST_MakePoint(-65.754800, -18.138400), 4326)),
('Cascada de Toro Toro', 'CASCADA', 'BUENO', 90, 2675.20, -65.749900, -18.142000, 618800.00, 8001250.00, 2, 2, ST_SetSRID(ST_MakePoint(-65.749900, -18.142000), 4326)),
('Ciudad de Itas', 'CANON', 'BUENO', 180, 3700.00, -65.710000, -18.078000, 620000.00, 8002000.00, 3, 1, ST_SetSRID(ST_MakePoint(-65.710000, -18.078000), 4326)),
('Huella de Dinosaurio', 'FOSIL', 'BUENO', 45, 2650.30, -65.765200, -18.133900, 617900.00, 8001350.00, 1, 4, ST_SetSRID(ST_MakePoint(-65.765200, -18.133900), 4326)),
('Caverna del Huayra Uta', 'CAVERNA', 'BUENO', 90, 2850.20, -65.762900, -18.140200, 617950.00, 8001200.00, 2, 1, ST_SetSRID(ST_MakePoint(-65.762900, -18.140200), 4326)),
('Puente Natural', 'CANON', 'BUENO', 45, 2725.10, -65.759000, -18.145800, 618200.00, 8001100.00, 1, 1, ST_SetSRID(ST_MakePoint(-65.759000, -18.145800), 4326)),
('Cascada Principal', 'CASCADA', 'BUENO', 60, 2705.00, -65.754000, -18.142800, 618600.00, 8001150.00, 2, 2, ST_SetSRID(ST_MakePoint(-65.754000, -18.142800), 4326)),
('Cementerio de Tortugas', 'FOSIL', 'BUENO', 40, 2660.00, -65.745300, -18.147200, 618900.00, 8001050.00, 1, 4, ST_SetSRID(ST_MakePoint(-65.745300, -18.147200), 4326)),
('Cañón de Toro Toro', 'CANON', 'BUENO', 120, 2700.00, -65.750000, -18.140000, 618750.00, 8001250.00, 3, 7, ST_SetSRID(ST_MakePoint(-65.750000, -18.140000), 4326)),
('Caverna Chillijchi', 'CAVERNA', 'DETERIORADO', 60, 2810.00, -65.760800, -18.131800, 618050.00, 8001380.00, 2, 1, ST_SetSRID(ST_MakePoint(-65.760800, -18.131800), 4326)),
('Llama Chaqui', 'FOSIL', 'BUENO', 30, 2680.50, -65.743600, -18.148900, 619200.00, 8001000.00, 1, 4, ST_SetSRID(ST_MakePoint(-65.743600, -18.148900), 4326)),
('Batea Coque', 'FOSIL', 'DETERIORADO', 25, 2675.80, -65.742800, -18.149500, 619300.00, 8000950.00, 1, 4, ST_SetSRID(ST_MakePoint(-65.742800, -18.149500), 4326)),
('Waca Senqeta', 'CAVERNA', 'RIESGO', 180, 2900.00, -65.715000, -18.085000, 622000.00, 8001800.00, 3, 7, ST_SetSRID(ST_MakePoint(-65.715000, -18.085000), 4326)),
('Siete Vueltas', 'CANON', 'BUENO', 150, 2750.00, -65.752000, -18.136000, 618700.00, 8001320.00, 2, 7, ST_SetSRID(ST_MakePoint(-65.752000, -18.136000), 4326)),
('Pinturas Rupestres', 'CAVERNA', 'DETERIORADO', 45, 2740.00, -65.757000, -18.134000, 618300.00, 8001340.00, 2, 5, ST_SetSRID(ST_MakePoint(-65.757000, -18.134000), 4326)),
('Aguada Caliente', 'CASCADA', 'BUENO', 75, 2690.00, -65.740000, -18.150000, 619500.00, 8000900.00, 1, 2, ST_SetSRID(ST_MakePoint(-65.740000, -18.150000), 4326)),
('Cerro Huayllas', 'MIRADOR', 'BUENO', 90, 3200.00, -65.730000, -18.120000, 620500.00, 8002200.00, 3, 7, ST_SetSRID(ST_MakePoint(-65.730000, -18.120000), 4326)),
('Quebrada Thola Pampa', 'CANON', 'BUENO', 100, 2715.00, -65.746500, -18.141500, 619100.00, 8001180.00, 2, 2, ST_SetSRID(ST_MakePoint(-65.746500, -18.141500), 4326)),
('Caverna Phaqcha Qaqa', 'CAVERNA', 'BUENO', 110, 2780.00, -65.759200, -18.129500, 618150.00, 8001400.00, 2, 1, ST_SetSRID(ST_MakePoint(-65.759200, -18.129500), 4326));

-- RUTAS DE ACCESO
INSERT INTO rutas_acceso (tipo_ruta, tiempo_est, distancia_km, condicion_ruta, medio_transp) VALUES
('CARRETERA', '01:30:00', 3.5, 'BUENA', 'PRIVADO'),
('SENDERISMO', '02:00:00', 2.1, 'MEDIA', 'COMPARTIDO'),
('CAMINO', '03:30:00', 4.8, 'DIFICIL', 'PRIVADO'),
('SENDERISMO', '01:00:00', 1.5, 'MEDIA', 'COMPARTIDO'),
('CARRETERA', '00:45:00', 5.0, 'BUENA', 'PRIVADO'),
('CAMINO', '02:30:00', 3.8, 'DIFICIL', 'PRIVADO'),
('SENDERISMO', '01:15:00', 2.0, 'MEDIA', 'COMPARTIDO'),
('SENDERISMO', '00:45:00', 1.2, 'MEDIA', 'COMPARTIDO'),
('CAMINO', '04:00:00', 8.5, 'DIFICIL', 'PRIVADO'),
('SENDERISMO', '00:30:00', 0.8, 'BUENA', 'COMPARTIDO'),
('CARRETERA', '02:15:00', 12.0, 'REGULAR', 'PRIVADO'),
('CAMINO', '01:45:00', 3.2, 'DIFICIL', 'PRIVADO');

-- RELACIONES RUTAS - ATRACTIVOS
INSERT INTO rutas_acceso_has_atractivo_turistico (rutas_acceso_id, atractivo_turistico_id) VALUES
(1, 1), (2, 2), (2, 3), (3, 4), (3, 5), (4, 6), (5, 7), (6, 8), (7, 9), 
(7, 10), (6, 11), (8, 12), (8, 13), (9, 14), (10, 15), (11, 16), (12, 17),
(9, 18), (10, 19), (11, 20), (1, 2), (2, 8), (3, 14), (4, 15), (5, 16);

-- ÁREAS PROTEGIDAS
INSERT INTO area_prot (area, perimetro, descripcion, atractivo_turistico_id) VALUES
(
  ST_GeomFromText('POLYGON((-65.763 -18.132, -65.760 -18.132, -65.760 -18.135, -65.763 -18.135, -65.763 -18.132))', 4326),
  ST_GeomFromText('LINESTRING(-65.763 -18.132, -65.760 -18.132, -65.760 -18.135, -65.763 -18.135, -65.763 -18.132)', 4326),
  'Área protegida de la Caverna de Umajalanta con formaciones únicas',
  1
),
(
  ST_GeomFromText('POLYGON((-65.755 -18.137, -65.752 -18.137, -65.752 -18.140, -65.755 -18.140, -65.755 -18.137))', 4326),
  ST_GeomFromText('LINESTRING(-65.755 -18.137, -65.752 -18.137, -65.752 -18.140, -65.755 -18.140, -65.755 -18.137)', 4326),
  'Zona de protección del Mirador del Vergel y su biodiversidad',
  2
),
(
  ST_GeomFromText('POLYGON((-65.7635 -18.140, -65.761 -18.140, -65.761 -18.142, -65.7635 -18.142, -65.7635 -18.140))', 4326),
  ST_GeomFromText('LINESTRING(-65.7635 -18.140, -65.761 -18.140, -65.761 -18.142, -65.7635 -18.142, -65.7635 -18.140)', 4326),
  'Área natural protegida de la Caverna del Huayra Uta',
  6
),
(
  ST_GeomFromText('POLYGON((-65.759 -18.145, -65.757 -18.145, -65.757 -18.147, -65.759 -18.147, -65.759 -18.145))', 4326),
  ST_GeomFromText('LINESTRING(-65.759 -18.145, -65.757 -18.145, -65.757 -18.147, -65.759 -18.147, -65.759 -18.145)', 4326),
  'Zona de protección del Puente Natural y su ecosistema',
  7
),
(
  ST_GeomFromText('POLYGON((-65.745 -18.147, -65.743 -18.147, -65.743 -18.149, -65.745 -18.149, -65.745 -18.147))', 4326),
  ST_GeomFromText('LINESTRING(-65.745 -18.147, -65.743 -18.147, -65.743 -18.149, -65.745 -18.149, -65.745 -18.147)', 4326),
  'Área fósil protegida del Cementerio de Tortugas',
  9
);

-- SERVICIOS COMPLETOS
INSERT INTO servicios (nombre, tipo_servicio, costo, direccion, telefono, calificacion, longitud, latitud, atractivo_turistico_id, geom) VALUES
('Hostal Umajalanta', 'HOTEL', 120, 'Barrio Central, Torotoro, Potosí', '75431212', 4.5, -65.763800, -18.135000, 1, ST_SetSRID(ST_MakePoint(-65.763800, -18.135000), 4326)),
('Restaurante El Vergel', 'RESTAURANTE', 60, 'Zona El Vergel, Torotoro, Potosí', '72456789', 4.7, -65.755200, -18.138200, 2, ST_SetSRID(ST_MakePoint(-65.755200, -18.138200), 4326)),
('Café Cascada', 'CAFETERIA', 35, 'Camino a la cascada, Torotoro, Potosí', '70321456', 4.3, -65.749500, -18.142500, 3, ST_SetSRID(ST_MakePoint(-65.749500, -18.142500), 4326)),
('Transporte Itas Tours', 'TRANSPORTE', 200, 'Av. Principal, Torotoro, Potosí', '75890123', 4.8, -65.710500, -18.078200, 4, ST_SetSRID(ST_MakePoint(-65.710500, -18.078200), 4326)),
('Guía DinoTracks', 'GUIA_TURISTICO', 150, 'Centro Turístico, Torotoro, Potosí', '75900234', 4.9, -65.764800, -18.134000, 5, ST_SetSRID(ST_MakePoint(-65.764800, -18.134000), 4326)),
('Eco Hotel Toro Toro', 'HOTEL', 180, 'Zona Central, Toro Toro, Potosí', '71234567', 4.8, -65.758000, -18.139000, 7, ST_SetSRID(ST_MakePoint(-65.758000, -18.139000), 4326)),
('Restaurante Sabor Andino', 'RESTAURANTE', 70, 'Av. Principal #45, Toro Toro, Potosí', '71321456', 4.6, -65.754500, -18.140200, 8, ST_SetSRID(ST_MakePoint(-65.754500, -18.140200), 4326)),
('Cafetería El Puente', 'CAFETERIA', 40, 'Camino al Puente Natural, Toro Toro', '71456789', 4.4, -65.758800, -18.145200, 7, ST_SetSRID(ST_MakePoint(-65.758800, -18.145200), 4326)),
('Guía Aventuras ToroToro', 'GUIA_TURISTICO', 120, 'Centro Turístico, Toro Toro, Potosí', '71567890', 4.9, -65.760200, -18.141000, 9, ST_SetSRID(ST_MakePoint(-65.760200, -18.141000), 4326)),
('Transporte El Cañón', 'TRANSPORTE', 220, 'Terminal Toro Toro, Potosí', '71678901', 4.7, -65.750200, -18.140000, 10, ST_SetSRID(ST_MakePoint(-65.750200, -18.140000), 4326)),
('Centro de Salud Toro Toro', 'CENTRO_DE_SALUD', 0, 'Zona Central, Toro Toro, Potosí', '71789012', 4.0, -65.755000, -18.138000, 6, ST_SetSRID(ST_MakePoint(-65.755000, -18.138000), 4326)),
('Alojamiento Waca Senqeta', 'HOTEL', 80, 'Comunidad Cruz Loma, Toro Toro, Potosí', '71890123', 4.2, -65.716500, -18.085500, 14, ST_SetSRID(ST_MakePoint(-65.716500, -18.085500), 4326)),
('Comedor Llama Chaqui', 'RESTAURANTE', 45, 'Camino a los fósiles, Toro Toro, Potosí', '71901234', 4.1, -65.743000, -18.149000, 12, ST_SetSRID(ST_MakePoint(-65.743000, -18.149000), 4326)),
('Guías Siete Vueltas', 'GUIA_TURISTICO', 100, 'Entrada Siete Vueltas, Toro Toro', '72012345', 4.6, -65.751500, -18.136200, 15, ST_SetSRID(ST_MakePoint(-65.751500, -18.136200), 4326)),
('Transporte Aguada Caliente', 'TRANSPORTE', 180, 'Terminal de buses Toro Toro, Potosí', '72123456', 4.3, -65.755500, -18.138500, 17, ST_SetSRID(ST_MakePoint(-65.755500, -18.138500), 4326)),
('Cabañas Cerro Huayllas', 'HOTEL', 150, 'Base Cerro Huayllas, Toro Toro, Potosí', '72234567', 4.4, -65.731000, -18.121000, 18, ST_SetSRID(ST_MakePoint(-65.731000, -18.121000), 4326)),
('Artesanías Toro Toro', 'GUIA_TURISTICO', 50, 'Mercado Artesanal Central, Toro Toro', '72345678', 4.7, -65.756000, -18.137000, 16, ST_SetSRID(ST_MakePoint(-65.756000, -18.137000), 4326)),
('Info Turística Toro Toro', 'GUIA_TURISTICO', 0, 'Plaza Principal 25 de Mayo, Toro Toro', '72456789', 4.5, -65.756200, -18.137500, 1, ST_SetSRID(ST_MakePoint(-65.756200, -18.137500), 4326)),
('Alquiler Equipo Espeleología', 'TRANSPORTE', 80, 'Calle Bolívar#234, Toro Toro, Potosí', '72567890', 4.3, -65.755800, -18.137800, 1, ST_SetSRID(ST_MakePoint(-65.755800, -18.137800), 4326)),
('Comedor El Mirador', 'RESTAURANTE', 35, 'Camino al Mirador del Vergel, Toro Toro', '72678901', 4.2, -65.754000, -18.139000, 2, ST_SetSRID(ST_MakePoint(-65.754000, -18.139000), 4326));

-- =====================
-- ÍNDICES ESPACIALES PARA MEJOR RENDIMIENTO
-- =====================
CREATE INDEX idx_atractivo_geom ON atractivo_turistico USING GIST(geom);
CREATE INDEX idx_servicios_geom ON servicios USING GIST(geom);
CREATE INDEX idx_area_prot_area ON area_prot USING GIST(area);
CREATE INDEX idx_atractivo_categoria ON atractivo_turistico(categoria_id);
CREATE INDEX idx_atractivo_riesgo ON atractivo_turistico(tipo_riesgo_id);

-- Para atractivo_turistico
ALTER TABLE atractivo_turistico 
ADD COLUMN geom geometry(Point, 4326);

UPDATE atractivo_turistico
SET geom = ST_SetSRID(ST_MakePoint(longitud, latitud), 4326)
WHERE longitud IS NOT NULL AND latitud IS NOT NULL;

-- Para servicios
ALTER TABLE servicios
ADD COLUMN geom geometry(Point, 4326);

UPDATE servicios
SET geom = ST_SetSRID(ST_MakePoint(longitud, latitud), 4326)
WHERE longitud IS NOT NULL AND latitud IS NOT NULL;
