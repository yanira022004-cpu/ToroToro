import { atractivoTuristicoCoords, getAtractivoTuristico, trackToroToro } from '../controller/atractivo_turistico'
import { Router } from 'express'
import { getServicios, getServicioCoord } from '../controller/servicios'
import { areaProtegida } from '../controller/areaProtegida'

export const router = Router()

router.get('/atractivo_turistico', getAtractivoTuristico)
router.get('/servicios', getServicios)
router.get('/servicio_coords', getServicioCoord)
router.get('/atractivo_coords', atractivoTuristicoCoords)
router.get('/track_toro_toro', trackToroToro)
router.get('/area_prot', areaProtegida)
