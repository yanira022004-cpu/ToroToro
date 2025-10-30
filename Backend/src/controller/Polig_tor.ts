import { Request, Response } from 'express'
import { pool } from '../config/db'

export const polig_tor = async (_req: Request, res: Response) => {
    try {
        const polig = await pool.query(
            'SELECT *, ST_AsGeoJSON(geom) AS geometry FROM "Polig_tor";'
        )

        const features = polig.rows.map((polig: any) => ({
            type: "Feature",
            geometry: JSON.parse(polig.geometry),
            properties: {
                ...polig,
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