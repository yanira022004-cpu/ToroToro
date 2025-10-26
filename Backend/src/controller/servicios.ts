import { Request, Response } from 'express'
import { pool } from '../config/db'

export const getServicios = async (_req: Request, res: Response) => {
  try {
    const servicios = await pool.query(`
      SELECT
        s.*,
        a.nombre AS nombre_atractivo,
        a.id_atrac_turist
      FROM
        servicios s
      JOIN
        atractivo_turistico a
      ON
        s.atractivo_turistico_id = a.id_atrac_turist;
    `)

    return res.status(200).json(servicios.rows)
  } catch (error) {
    console.error('Error en getServicios:', error)
    return res.status(500).json({ 
      error: 'Error interno del servidor'
    })
  }
}

export const getServicioCoord = async (_req: Request, res: Response) => {
  try {
    const coordServicios = await pool.query(`
      SELECT 
        s.id_servicio,
        s.latitud, 
        s.longitud,
        s.nombre AS nombre_servicio,
        s.tipo_servicio,
        s.costo,
        s.direccion,
        s.telefono,
        s.calificacion,
        a.nombre AS nombre_atractivo
      FROM servicios s
      JOIN atractivo_turistico a ON s.atractivo_turistico_id = a.id_atrac_turist;
    `)

    return res.status(200).json(coordServicios.rows)
  } catch (error) {
    console.error('Error en getServicioCoord:', error)
    return res.status(500).json({ 
      error: 'Error interno del servidor',
    })
  }
}