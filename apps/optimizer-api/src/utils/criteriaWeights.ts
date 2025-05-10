import type {OptimizationModeName, RankingMethod} from '@libs/shared/types/src/optimizer'

export interface CriteriaWeights {
    price: number;
    deliveryTime: number;
    shopScore: number;
  }

export function getWeightsForMode(mode: OptimizationModeName): CriteriaWeights {
  switch (mode) {
    case 'cheapest':
      return { price: 0.7, deliveryTime: 0.2, shopScore: 0.1 };
    case 'fastest':
      return { price: 0.2, deliveryTime: 0.7, shopScore: 0.1 };
    default:
      throw new Error(`Unsupported optimization mode: ${mode}`);
  }
}