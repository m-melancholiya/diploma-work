export type OptimizationModeName = 'cheapest' | 'fastest' | 'discounted';
export type RankingMethod = 'topsis' | 'wsm';

export interface CriteriaWeights {
    price: number;
    deliveryTime: number;
    discount: number;
  }

export function getWeightsForMode(mode: OptimizationModeName): CriteriaWeights {
  switch (mode) {
    case 'cheapest':
      return { price: 0.7, deliveryTime: 0.2, discount: 0.1 };
    case 'fastest':
      return { price: 0.2, deliveryTime: 0.7, discount: 0.1 };
    case 'discounted':
      return { price: 0.3, deliveryTime: 0.1, discount: 0.6 };
    default:
      throw new Error(`Unsupported optimization mode: ${mode}`);
  }
}