import express, { Application } from 'express'
import { router } from './routes/routes'
import cors from 'cors'

export const app: Application = express()

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use('/api', router)
