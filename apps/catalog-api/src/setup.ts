import express from 'express'
import productsRouter from './routes/products'
import pricesRouter   from './routes/prices'
import geocodeRouter  from './routes/geocode'
import cors from 'cors'

export function createApp() {
    const app = express()
    app.use(express.json())
    app.use(cors())
    app.use('/products', productsRouter)
    app.use('/prices', pricesRouter)
    app.use('/geocode', geocodeRouter)
    return app
}
