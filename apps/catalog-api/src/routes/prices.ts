// apps/catalog-api/src/routes/prices.ts
// Handles routes related to product prices.

import { Router } from 'express';
import { fetchPrices } from '../services/fetchPrices';

const router = Router();

router.post('/by-eans', async (req, res) => {
  const { eans, clientCoords } = req.body as { eans: string[], clientCoords?: string };

  // Validate that eans is an array and is not empty
  if (!Array.isArray(eans) || eans.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid eans[] in request body' });
  }

  try {
    // Fetch prices for all EANs concurrently
    const allPricesPromises = eans.map((ean: string) => fetchPrices(ean, clientCoords));
    const allPricesArrays = await Promise.all(allPricesPromises);

    // Flatten the array of arrays into a single array of price alternatives
    const flattenedAlternatives = allPricesArrays.flat();

    // Deduplicate alternatives based on a composite key (chainId-storeId-ean-price)
    // This prevents sending multiple identical entries if the source API returns them.
    const deduplicatedAlternatives = Array.from(
        new Map(
            flattenedAlternatives.map(item => [`${item.chainId}-${item.storeId}-${item.ean}-${item.price}`, item])
        ).values()
    );

    // Send the deduplicated alternatives as a JSON response.
    // CRITICAL FIX: Only one response should be sent.
    // The previous code attempted to send res.json() twice.
    res.json({ alternatives: deduplicatedAlternatives });

  } catch (err) {
    // Log the detailed error on the server for debugging
    console.error('❌ Failed to fetch prices by eans:', err);
    // Send a generic 500 Internal Server Error response to the client
    res.status(500).json({ error: 'Internal server error while fetching prices' });
  }
});

export default router;
