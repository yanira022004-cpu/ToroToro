import { Request, Response } from 'express'
import { pool } from '../config/db'

export const comunidades = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT *, ST_AsGeoJSON(geom) AS geom FROM "Comunidades";',
        )

        const features = result.rows.map((row) => ({
            type: 'Feature',
            geometry: JSON.parse(row.geom),
            properties: {
                ...row,
                geom: undefined, // Remove the geom field from properties
            },
        }))

        const geojson = {
            type: 'FeatureCollection',
            features: features,
        }

        return res.json(geojson)
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}