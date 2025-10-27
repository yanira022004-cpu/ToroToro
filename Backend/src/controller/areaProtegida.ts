import { Request, Response } from 'express'
import { pool } from '../config/db'

export const areaProtegida = async (_req: Request, res: Response) => {
    try {
        const area = await pool.query(`
            SELECT 
                id_area_prot, 
                ST_AsGeoJSON(area) AS area_geojson,
                ST_AsGeoJSON(perimetro) AS perimetro_geojson,
                descripcion, 
                atractivo_turistico_id 
            FROM area_prot
        `)
        return res.status(200).json(area.rows)
    } catch (error) {
        return res.status(400).json({
            error: error instanceof Error ? error.message : error
        })
    }
}
