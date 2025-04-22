// utils/criteriaDirections.ts

/**
 * Тип напрямку оптимізації: 'min' означає, що критерій потрібно мінімізувати,
 * 'max' — що потрібно максимізувати.
 */
export type CriterionDirection = 'min' | 'max';

/**
 * Повертає напрямки оптимізації для кожного критерію.
 * Напрямки є фіксованими: наприклад, ціну зазвичай мінімізують, а знижку — максимізують.
 */
export function getCriteriaDirections(): Record<string, CriterionDirection> {
  return {
    price: 'min',
    discount: 'max',
    deliveryTime: 'min',
    shopCount: 'min',
  };
}