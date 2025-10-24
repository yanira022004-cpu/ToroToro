import { app } from './server'
import { PORT } from './config/env'
import { connect } from './config/db'

connect()

app.listen(PORT, () => {
  console.table({
    URL: `http://localhost:${PORT}`
  })
})
