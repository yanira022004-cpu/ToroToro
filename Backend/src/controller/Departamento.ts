import { Request, Response } from 'express'
import { pool } from '../config/db'

export const departamentos = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT *, ST_AsGeoJSON(geom) AS geometry FROM "Departamentos";'
    )

    const features = result.rows.map(dep => ({
      type: "Feature",
      geometry: JSON.parse(dep.geometry),
      properties: {
        ...dep,
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
