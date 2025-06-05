// apps/optimizer-api/src/utils/criteriaDirections.ts
// Визначає напрямки оптимізації для кожного критерію.

export type CriterionDirection = 'min' | 'max';

export interface CriteriaKeys {
  price: any;
  shopScore: any;
  deliveryTime: any;
}

export type CriteriaDirections = Record<keyof CriteriaKeys, CriterionDirection>;

let memoizedDirections: CriteriaDirections | null = null;

export function getCriteriaDirections(): CriteriaDirections {
  if (memoizedDirections) {
    return memoizedDirections;
  }
  memoizedDirections = {
    price: 'min',
    deliveryTime: 'min',
    shopScore: 'max',
  };
  console.log('[getCriteriaDirections] Напрямки критеріїв:', memoizedDirections);
  return memoizedDirections;
}
