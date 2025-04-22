import { Router } from 'express'
import { topsisRank } from '../services/topsis'
import { wsmRank }   from '../services/wsm'
import { solveGreedy } from '../services/greedySolver'
import { getWeightsForMode } from '../utils/criteriaWeights'
import {
  Alternative,
  OptimizationRequest,
  OptimizationResponse
} from '../types/optimizer'

const router = Router()

router.post('/optimize', async (req, res) => {
  try {
    const { items, mode } = req.body as OptimizationRequest

    const criteriaWeights = getWeightsForMode(mode.name)

    let ranked: Alternative[]
    if (mode.rankingMethod === 'topsis') {
      ranked = topsisRank(items, criteriaWeights)
    } else if (mode.rankingMethod === 'wsm') {
      ranked = wsmRank(items, criteriaWeights)
    } else {
      return res.status(400).json({ error: 'Unsupported ranking method' })
    }

    const solution = solveGreedy(ranked)

    const response: OptimizationResponse = {
      ranking:       ranked,
      selectedItems: solution
    }

    res.json(response)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router