import { Request, Response } from 'express'
import { pool } from '../config/db'

export const getAtractivoTuristico = async (_req: Request, res: Response) => {
  try {
    const atractivo_turistico = await pool.query(`SELECT 
      a.id_atrac_turist,
      a.nombre AS nombre_atractivo,
      a.tipo_atractivo,
      a.estado,
      a.tiempo_visita,
      a.elevacion,
      a.longitud,
      a.latitud,
      a.este,
      a.norte,
      c.nombre_categoria,
      t.nivel AS nivel_riesgo
    FROM 
      atractivo_turistico a
    JOIN 
      categoria c ON a.categoria_id = c.id_categoria
    JOIN 
      tipo_riesgo t ON a.tipo_riesgo_id = t.id_tipo_riesgo;
    `)

    return res.status(200).json(atractivo_turistico.rows)
  } catch (error) {
    console.error('Error en getAtractivoTuristico:', error)
    return res.status(500).json({ 
      error: 'Error interno del servidor'
    })
  }
}

export const atractivoTuristicoCoords = async (_req: Request, res: Response) => {
  try {
    const coords = await pool.query(`
      SELECT 
        id_atrac_turist,
        nombre,
        tipo_atractivo,
        estado,
        tiempo_visita,
        elevacion,
        longitud,
        latitud,
        este,
        norte,
        tipo_riesgo_id,
        categoria_id
      FROM atractivo_turistico
    `)

    return res.status(200).json(coords.rows)
  } catch (error) {
    console.error('Error en atractivoTuristicoCoords:', error)
    return res.status(500).json({ 
      error: 'Error interno del servidor'
    })
  }
}

export const trackToroToro = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        type,
        ST_AsGeoJSON(ST_Transform(geom, 4326))::json AS geometry
      FROM "Capa_Rutas";
    `)

    const geojson = {
      type: "FeatureCollection",
      features: result.rows.map((row) => ({
        type: "Feature",
        geometry: row.geometry,
        properties: {
          id: row.id,
          name: row.name,
          type: row.type,
        },
      })),
    }

    return res.status(200).json(geojson)
  } catch (error) {
    console.error("Error obteniendo tracks:", error)
    return res.status(500).json({ message: "Error obteniendo tracks", error })
  }
}

export const getAllAtractivoTuristicoTipoRiesgoCategoria = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT at.id_atrac_turist AS id_atractivo, at.nombre AS nombre_atractivo, at.tipo_atractivo, at.estado, at.tiempo_visita, at.elevacion, at.longitud, at.latitud, tr.nivel AS nivel_riesgo, tr.descripcion AS descripcion_riesgo, c.nombre_categoria, c.descripcion AS descripcion_categoria FROM atractivo_turistico at INNER JOIN tipo_riesgo tr ON at.tipo_riesgo_id = tr.id_tipo_riesgo INNER JOIN categoria c ON at.categoria_id = c.id_categoria;'
    )

    return res.status(200).json(result.rows)
  } catch (error) {
    return res.status(500).json({ message: 'Error obteniendo atractivos turísticos con detalles', error })
  }
}
