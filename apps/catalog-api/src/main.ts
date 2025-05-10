import express from 'express';
import productsRouter from './routes/products';
import pricesRouter from './routes/prices';
import geocodeRouter from './routes/geocode';
import cors from 'cors'

const app = express();
const PORT = 3001;
app.use(express.json())
app.use(cors())

app.use('/products', productsRouter);
app.use('/prices', pricesRouter);
app.use('/address', geocodeRouter);

app.listen(PORT, () => {
  console.log(`📦 catalog-api running on http://localhost:${PORT}`);
});