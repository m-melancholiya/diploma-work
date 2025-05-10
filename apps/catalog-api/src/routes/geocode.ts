import { Router } from 'express';
import { geocodeAddress } from '../services/geocodeAddress';

const router = Router();

router.get('/geocode', async (req, res) => {
  const address = req.query.address as string;

  if (!address) {
    return res.status(400).json({ error: 'Missing ?address= parameter' });
  }

  try {
    const coords = await geocodeAddress(address);
    if (!coords) {
      return res.status(404).json({ error: 'Address not found or invalid' });
    }

    res.json({ coords });
  } catch (err) {
    console.error('❌ Error in /api/geocode route:', err);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

export default router;