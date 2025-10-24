import { Request, Response } from 'express'
import { pool } from '../config/db'

export const getAtractivoTuristico = async (_req: Request, res: Response) => {
  const atractivo_turistico = await pool.query(`SELECT 
    a.nombre AS nombre_atractivo,
    a.tipo_atractivo,
    a.estado,
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
}

export const atractivoTuristicoCoords = async (_req: Request, res: Response) => {
  const coords = await pool.query(
    'SELECT latitud, longitud FROM atractivo_turistico'
  )

  return res.status(200).json(coords.rows)
}
