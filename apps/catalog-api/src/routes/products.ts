import { Router } from 'express';
import { searchZakaz } from '../services/searchZakaz';
const router = Router();

router.get('/', async (req, res) => {
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({ error: 'Missing ?q= parameter' });
  }

  try {
    const results = await searchZakaz(query);
    res.json(results);
  } catch (err) {
    console.error('❌ Error in /products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;