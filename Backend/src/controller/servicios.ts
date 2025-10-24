import { Request, Response } from 'express'
import { pool } from '../config/db'

export const getServicios = async (_req: Request, res: Response) => {
  const servicios = await pool.query(`
    SELECT
    s.nombre AS nombre_servicio,
    s.tipo_servicio,
    s.costo,
    s.direccion,
    s.telefono,
    s.calificacion,
    a.nombre AS nombre_atractivo
FROM
    servicios s
JOIN
    atractivo_turistico a
ON
    s.atractivo_turistico_id = a.id_atrac_turist;

    `)

  return res.status(200).json(servicios.rows)
}

export const getServicioCoord = async (_req: Request, res: Response) => {
  const coordServicios = await pool.query(
    'SELECT latitud, longitud FROM servicios;',
  )

  return res.status(200).json(coordServicios.rows)
}
