import { getAtractivoTuristico } from '../controller/atractivo_turistico'
import { Router } from 'express'
import { getServicios } from '../controller/servicios'

export const router = Router()

router.get('/atractivo_turistico', getAtractivoTuristico)
router.get('/servicios', getServicios)
