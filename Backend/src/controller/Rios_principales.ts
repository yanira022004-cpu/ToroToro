import { Request, Response } from 'express'
import { pool } from '../config/db'

export const rios_principales = async (_req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT *, ST_AsGeoJSON(geom) AS geometry FROM "Rios_Principales";'
        )

        const features = result.rows.map((row: any) => ({
            type: "Feature",
            geometry: JSON.parse(row.geometry),
            properties: {
                ...row,
                geometry: undefined
            }
        }))

        const geojson = {
            type: "FeatureCollection",
            features
        }

        return res.status(200).json(geojson)
        
    } catch (error) {
        return res.status(400).json({
            error: error instanceof Error ? error.message : error
        })
    }
}