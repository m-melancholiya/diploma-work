import { Router } from 'express';
import { searchZakaz } from '../services/searchZakaz';
const router = Router();

router.get('/search', async (req, res) => {
  const query = req.query.query as string;
  console.log('🛠️ Отриманий пошук:', query);

  if (!query) {
    return res.status(400).json({ error: 'Missing ?query= parameter' });
  }

  try {
    const results = await searchZakaz(query);
    console.log('🔎 Знайдено результатів:', results.length);
    res.json({ products: results });
  } catch (err) {
    console.error('❌ Error in /products/search:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;