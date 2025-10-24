import { Pool } from 'pg'
import env from 'dotenv'

env.config()

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

export const connect = async () => {
  try {
    await pool.connect()
    console.log('Database connected')
  } catch (error) {
    console.log(error)
  }
}
