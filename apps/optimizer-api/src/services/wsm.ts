// apps/optimizer-api/src/services/wsm.ts

import { AlternativePayload, CriteriaWeights } from '@libs/shared/types/src/optimizer';
import { WsmNormalization } from '../utils/normalization/WsmNormalization';
import { getShopScore } from '../utils/shopScoreCalculator';

export function wsmRank(items: AlternativePayload[], weights: CriteriaWeights): AlternativePayload[] {
  if (!items || items.length === 0) {
    console.log('[WSM] Вхідний масив альтернатив порожній.');
    return [];
  }

  if (items.length === 1) {
    console.warn('[WSM] ⚠️ У товару лише одна альтернатива — всі нормалізовані значення будуть 1.');
  }

  const criteriaKeys = Object.keys(weights) as (keyof CriteriaWeights)[];

  // Крок 1: Побудова матриці прийняття рішень
  const matrix = items.map(item =>
      criteriaKeys.map(key => {
        let value: number | undefined;

        if (key === 'shopScore') {
          value = typeof item.shopScore === 'number' ? item.shopScore : getShopScore(item.shop);
        } else {
          value = item[key as keyof Omit<AlternativePayload, 'shopScore'>] as number | undefined;
        }

        return typeof value === 'number' && !isNaN(value) ? value : 0;
      })
  );

  console.log('\n[WSM] 📌 Крок 1: Матриця прийняття рішень (з актуальним shopScore)');
  console.table(matrix);

  // Крок 2: Нормалізація
  const normalizer = new WsmNormalization();
  const normalizedMatrix = normalizer.normalize(matrix);
  console.log('\n[WSM] 📌 Крок 2: Нормалізована матриця (після WsmNormalization, 1 - краще)');
  console.table(normalizedMatrix);

  // Крок 3: Зважена матриця
  const weightedMatrix = normalizedMatrix.map(row =>
      row.map((val, j) => val * weights[criteriaKeys[j]])
  );
  console.log('\n[WSM] 📌 Крок 3: Зважена нормалізована матриця');
  const displayWeighted = weightedMatrix.map(row => row.map(v => Number(v.toFixed(2))));
  console.table(displayWeighted);

  // Крок 4: Підрахунок score
  const scores = weightedMatrix.map(row =>
      row.reduce((sum, val) => sum + val, 0)
  );

  console.log('\n[WSM] 📌 Крок 4: Розрахунок WSM score');
  const displayScores = scores.map(s => Number(s.toFixed(2)));
  console.table(displayScores);

  const result = items.map((item, i) => ({ ...item, score: scores[i] }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  console.log('\n[WSM] 📌 Крок 5: Відсортовані альтернативи за WSM score');
  console.table(result.map((r, i) => ({
    id: r.id,
    ean: r.ean,
    shop: r.shop,
    price: r.price,
    deliveryTime: r.deliveryTime,
    shopScore: matrix[i]?.[criteriaKeys.indexOf('shopScore')] ?? 'N/A',
    score: r.score?.toFixed(4)
  })));

  return result;
}
