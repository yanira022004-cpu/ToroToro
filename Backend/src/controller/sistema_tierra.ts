import { Request, Response } from 'express'
import { pool } from '../config/db'

export const sistemas_tierra = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT *, ST_AsGeoJSON(geom) AS geometry FROM "Sistema_tierra";'
        )

        const features = result.rows.map((row) => ({
            type: 'Feature',
            geometry: JSON.parse(row.geometry),
            properties: {
                ...row,
                geometry: undefined,
            },
        }))

        const geojson = {
            type: 'FeatureCollection',
            features: features,
        }

        return res.json(geojson)
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
}