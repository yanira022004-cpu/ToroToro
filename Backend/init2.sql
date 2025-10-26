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
-- INSERCIÓN DE SERVICIOS DE TOROTORO
-- =====================
INSERT INTO servicios (nombre, tipo_servicio, costo, direccion, telefono, calificacion, longitud, latitud, atractivo_turistico_id, geom) VALUES
-- Servicios cerca de Plaza Principal ToroToro (id_atrac_turist = 16)
('Hostal Mirador ToroToro', 'HOTEL', 120, 'Calle Bolívar frente a la plaza principal', '+591 4 1234567', 4.2, -65.762850, -18.133450, 16, ST_SetSRID(ST_MakePoint(-65.762850, -18.133450), 4326)),
('Restaurante El Cañón', 'RESTAURANTE', 80, 'Plaza Principal ToroToro', '+591 4 1234568', 4.5, -65.762920, -18.133520, 16, ST_SetSRID(ST_MakePoint(-65.762920, -18.133520), 4326)),
('Transporte Turístico ToroToro Tours', 'TRANSPORTE', 150, 'Terminal de buses ToroToro', '+591 4 1234569', 4.0, -65.763100, -18.133800, 16, ST_SetSRID(ST_MakePoint(-65.763100, -18.133800), 4326)),
('Guías Locales ToroToro Adventure', 'GUIA_TURISTICO', 100, 'Oficina de turismo municipal', '+591 4 1234570', 4.7, -65.762780, -18.133600, 16, ST_SetSRID(ST_MakePoint(-65.762780, -18.133600), 4326)),

-- Servicios cerca de Caverna de Umajalanta (id_atrac_turist = 1)
('Albergue Umajalanta', 'HOTEL', 90, 'Camino a Caverna Umajalanta', '+591 4 1234571', 4.1, -65.810000, -18.115000, 1, ST_SetSRID(ST_MakePoint(-65.810000, -18.115000), 4326)),
('Cafetería La Caverna', 'CAFETERIA', 35, 'Entrada Caverna Umajalanta', '+591 4 1234572', 4.3, -65.811200, -18.114800, 1, ST_SetSRID(ST_MakePoint(-65.811200, -18.114800), 4326)),

-- Servicios cerca de Cascada El Vergel (id_atrac_turist = 3)
('Refugio El Vergel', 'HOTEL', 110, 'Sendero a Cascada El Vergel', '+591 4 1234573', 4.4, -65.774500, -18.111800, 3, ST_SetSRID(ST_MakePoint(-65.774500, -18.111800), 4326)),
('Restaurante La Cascada', 'RESTAURANTE', 70, 'Mirador Cascada El Vergel', '+591 4 1234574', 4.6, -65.774300, -18.111600, 3, ST_SetSRID(ST_MakePoint(-65.774300, -18.111600), 4326)),

-- Servicios cerca de Huellas de Dinosaurio (id_atrac_turist = 9)
('Centro de Interpretación Paleontológico', 'GUIA_TURISTICO', 50, 'Sitio Huellas de Dinosaurio', '+591 4 1234575', 4.8, -65.761000, -18.132200, 9, ST_SetSRID(ST_MakePoint(-65.761000, -18.132200), 4326)),
('Cafetería Dino Track', 'CAFETERIA', 40, 'Camino a huellas de dinosaurios', '+591 4 1234576', 4.2, -65.760500, -18.132500, 9, ST_SetSRID(ST_MakePoint(-65.760500, -18.132500), 4326)),

-- Servicios cerca de Ciudad de Itas (id_atrac_turist = 12)
('Campamento Itas', 'HOTEL', 60, 'Base Ciudad de Itas', '+591 4 1234577', 3.9, -65.881000, -18.106500, 12, ST_SetSRID(ST_MakePoint(-65.881000, -18.106500), 4326)),
('Guías Especializados Itas', 'GUIA_TURISTICO', 120, 'Acceso a Ciudad de Itas', '+591 4 1234578', 4.9, -65.882000, -18.106000, 12, ST_SetSRID(ST_MakePoint(-65.882000, -18.106000), 4326)),

-- Servicios médicos y otros esenciales
('Centro de Salud ToroToro', 'CENTRO_DE_SALUD', 0, 'Av. Principal ToroToro', '+591 4 1234579', 4.0, -65.763500, -18.134000, 16, ST_SetSRID(ST_MakePoint(-65.763500, -18.134000), 4326)),
('Puesto de Socorro Umajalanta', 'CENTRO_DE_SALUD', 0, 'Camino a caverna Umajalanta', '+591 4 1234580', 3.8, -65.809500, -18.115500, 1, ST_SetSRID(ST_MakePoint(-65.809500, -18.115500), 4326)),

-- Servicios cerca de Mirador del Cóndor (id_atrac_turist = 8)
('Refugio El Cóndor', 'HOTEL', 130, 'Base Mirador del Cóndor', '+591 4 1234581', 4.3, -65.683500, -18.202800, 8, ST_SetSRID(ST_MakePoint(-65.683500, -18.202800), 4326)),
('Transporte Aventura Extrema', 'TRANSPORTE', 200, 'Ruta a Mirador del Cóndor', '+591 4 1234582', 4.1, -65.684000, -18.203200, 8, ST_SetSRID(ST_MakePoint(-65.684000, -18.203200), 4326)),

-- Servicios cerca de Cementerio de Tortugas (id_atrac_turist = 10)
('Campamento Paleontológico', 'HOTEL', 85, 'Cerca Cementerio de Tortugas', '+591 4 1234583', 4.0, -65.750500, -18.158000, 10, ST_SetSRID(ST_MakePoint(-65.750500, -18.158000), 4326)),
('Guía Especializado Fósiles', 'GUIA_TURISTICO', 90, 'Sitio Cementerio de Tortugas', '+591 4 1234584', 4.7, -65.749500, -18.158300, 10, ST_SetSRID(ST_MakePoint(-65.749500, -18.158300), 4326)),

-- Servicios generales adicionales
('Hotel Plaza ToroToro', 'HOTEL', 180, 'Plaza Principal', '+591 4 1234585', 4.4, -65.762600, -18.133300, 16, ST_SetSRID(ST_MakePoint(-65.762600, -18.133300), 4326)),
('Restaurante Tradicional Andino', 'RESTAURANTE', 95, 'Calle Comercio ToroToro', '+591 4 1234586', 4.6, -65.763200, -18.133900, 16, ST_SetSRID(ST_MakePoint(-65.763200, -18.133900), 4326)),
('Agencia de Viajes ToroToro', 'TRANSPORTE', 180, 'Oficina central de tours', '+591 4 1234587', 4.3, -65.762400, -18.133700, 16, ST_SetSRID(ST_MakePoint(-65.762400, -18.133700), 4326));