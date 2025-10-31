import { atractivoTuristicoCoords, getAllAtractivoTuristicoTipoRiesgoCategoria, getAtractivoTuristico, trackToroToro } from '../controller/atractivo_turistico'
import { Router } from 'express'
import { getServicios, getServicioCoord } from '../controller/servicios'
import { areaProtegida } from '../controller/areaProtegida'
import { departamentos } from '../controller/Departamento'
import { localidades } from '../controller/Localidades'
import { polig_tor } from '../controller/Polig_tor'
import { rios_principales } from '../controller/Rios_principales'
import { rios_secundarios } from '../controller/Rios_secundarios'
import { viasSecundarias } from '../controller/ViasSecundarias'
import { comunidades } from '../controller/Comunidades'
import { viasPrincipales } from '../controller/ViasPrincipal'

export const router = Router()

router.get('/atractivo_turistico', getAtractivoTuristico)
router.get('/servicios', getServicios)
router.get('/servicio_coords', getServicioCoord)
router.get('/atractivo_coords', atractivoTuristicoCoords)
router.get('/track_toro_toro', trackToroToro)
router.get('/area_prot', areaProtegida)
router.get('/all', getAllAtractivoTuristicoTipoRiesgoCategoria)
router.get('/departamentos', departamentos)
router.get('/localidades', localidades)
router.get('/polig_tor', polig_tor)
router.get('/rios_principales', rios_principales)
router.get('/rios_secundarios', rios_secundarios)
router.get('/vias_secundarias', viasSecundarias)
router.use('/comunidades', comunidades)
router.get('/vias_principales', viasPrincipales)
