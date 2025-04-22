import express from 'express'
import cors from 'cors'
import optimizerRouter from './routes/optimizer'

const app = express()
const PORT = process.env.PORT || 3002

// — body‐parser (built into Express) so we can read req.body
app.use(express.json())

// — cors middleware so clients from your browser can talk to it
app.use(cors())

// — mount your optimizer routes
// since optimizerRouter.post('/optimize', …) is defined,
// mounting it at '/' will give you POST http://…/optimize
app.use('/', optimizerRouter)

app.listen(PORT, () => {
  console.log(`🚀 optimizer-api listening on http://localhost:${PORT}`)
})