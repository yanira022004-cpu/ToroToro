import { Request, Response } from 'express'
import { pool } from '../config/db'

export const viasSecundarias = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT *, ST_AsGeoJSON(geom) AS geometry FROM "ViasSecundarias";'
        )

        const features = result.rows.map((row) => ({
            type: 'Feature',
            geometry: JSON.parse(row.geometry),
            properties: {
                ...row,
                geometry: undefined
            }
        }))

        const geojson = {
            type: 'FeatureCollection',
            features
        }

        return res.status(200).json(geojson)
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las vías secundarias', error })
    }
}
