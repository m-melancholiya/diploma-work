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
    res.json({ coords });
  } catch (err) {
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});