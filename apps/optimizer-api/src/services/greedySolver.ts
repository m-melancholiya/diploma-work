import { Alternative } from '../types/optimizer';

/**
 * Жадібний алгоритм: для кожного товару обирає альтернативу з найвищим рейтингом
 * @param ranked Альтернативи, вже відсортовані за score (TOPSIS або WSM)
 * @returns Оптимальний набір альтернатив (по одному для кожного товару)
 */
export function solveGreedy(ranked: Alternative[]): Alternative[] {
  const selected: Record<string, Alternative> = {};

  for (const item of ranked) {
    if (!selected[item.productId]) {
      selected[item.productId] = item;
    }
  }

  return Object.values(selected);
}
