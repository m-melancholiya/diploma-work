import { Router } from 'express'
import { fetchPrices } from '../services/fetchPrices'

const router = Router()

router.post('/by-eans', async (req, res) => {
  const { eans, clientCoords } = req.body as { eans: string[], clientCoords?: string };

  if (!Array.isArray(eans) || eans.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid eans[]' })
  }

  try {
    const allPrices = await Promise.all(
      eans.map((ean: string) => fetchPrices(ean, clientCoords))
    )

    // плоский масив усіх альтернатив по всіх eans
    const result = allPrices.flat()
    res.json({ alternatives: result })
  } catch (err) {
    console.error('❌ Failed to fetch prices by eans:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router