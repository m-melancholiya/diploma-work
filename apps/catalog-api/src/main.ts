import express from 'express';
import productsRouter from './routes/products';
import pricesRouter from './routes/prices';

const app = express();
const PORT = 3001;

app.use('/products', productsRouter);
app.use('/prices', pricesRouter);

app.listen(PORT, () => {
  console.log(`📦 catalog-api running on http://localhost:${PORT}`);
});