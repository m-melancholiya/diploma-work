import { OptimizedCartResult } from '@libs/shared/types/src/optimizer-cart';
import { Alternative } from '@libs/shared/types/src/optimizer';

export function solveGreedy(
  alternativesPerProduct: Alternative[][],
  maxBudget?: number,
  maxWeight?: number
): OptimizedCartResult {
  const selectedAlternatives: Alternative[] = [];
  let totalPrice = 0;
  let totalWeight = 0;

  for (const alternatives of alternativesPerProduct) {
    for (const alt of alternatives) {
      const nextTotalPrice = totalPrice + alt.price;
      const nextTotalWeight = totalWeight + alt.weight;

      if (
        (maxBudget === undefined || nextTotalPrice <= maxBudget) &&
        (maxWeight === undefined || nextTotalWeight <= maxWeight)
      ) {
        selectedAlternatives.push(alt);
        totalPrice = nextTotalPrice;
        totalWeight = nextTotalWeight;
        break;
      }
    }
  }

  return {
    selectedAlternatives,
    totalPrice,
    totalWeight
  };
}