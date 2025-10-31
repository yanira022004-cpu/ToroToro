import { Request, Response } from 'express'
import { pool } from '../config/db'

export const maya = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT *, ST_AsGeoJSON(geom) AS geometry_geojson FROM "mmaya_aps";'
        )

        const features = result.rows.map((row) => ({
            type: 'Feature',
            geometry: JSON.parse(row.geometry_geojson),
            properties: {
                ...row,
                geometry_geojson: undefined, // Exclude the geometry_geojson from properties
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