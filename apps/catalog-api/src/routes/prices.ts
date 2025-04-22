import { Router } from 'express';
import { fetchPrices } from '../services/fetchPrices';
const router = Router();

router.get('/', async (req, res) => {
  const ean = req.query.ean as string;

  if (!ean) {
    return res.status(400).json({ error: 'Missing ?ean= parameter' });
  }

  try {
    const prices = await fetchPrices(ean);
    res.json(prices);
  } catch (err) {
    console.error('❌ Error in /prices:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;