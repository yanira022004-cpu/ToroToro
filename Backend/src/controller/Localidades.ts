import { Request, Response } from 'express'
import { pool } from '../config/db'

export const localidades = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT *, ST_AsGeoJSON(geom) AS geometry FROM "Localidades";'
    )

    const features = result.rows.map(loc => ({
      type: "Feature",
      geometry: JSON.parse(loc.geometry),
      properties: {
        id: loc.id,
        gml_id: loc.gml_id,
        nombre: loc.NOMBRE,
        codigo: loc.codigo,
        descripcion: loc.descripcion,
        categoria: loc.CATEGORIA,
        subcateg: loc.SUBCATEGOR,
        codigo_obj: loc.codigo_obj
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
