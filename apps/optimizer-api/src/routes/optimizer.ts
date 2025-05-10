import { Router } from 'express'
import { topsisRank } from '../services/topsis'
import { wsmRank }   from '../services/wsm'
import { solveGreedy } from '../services/greedySolver'
import { getWeightsForMode } from '../utils/criteriaWeights'
import {
  Alternative,
  OptimizationRequest,
  OptimizationResponse
} from '@libs/shared/types/src/optimizer'

const router = Router()

router.post('/optimize', (req, res) => {
  const { items, mode, maxBudget } = req.body as OptimizationRequest & { maxBudget?: number }

  const weights = getWeightsForMode(mode.name)

  const selectedAlternativesPerProduct: Alternative[] = []
  const fullRanking: Alternative[] = []

  for (const product of items) {
    let ranked: Alternative[]
    if (mode.rankingMethod === 'topsis') {
      ranked = topsisRank(product.alternatives, weights)
    } else {
      ranked = wsmRank(product.alternatives, weights)
    }

    fullRanking.push(...ranked)

    if (ranked.length > 0) {
      selectedAlternativesPerProduct.push(ranked[0])
    }
  }

  const optimizedCart = solveGreedy(
    selectedAlternativesPerProduct.map(alt => [alt]),
    maxBudget
  );

  const response: OptimizationResponse = {
    ranking: fullRanking,
    selectedItems: optimizedCart.selectedAlternatives
  };

  res.json(response);
});

export default router;