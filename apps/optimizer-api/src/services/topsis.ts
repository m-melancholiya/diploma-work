import { AlternativePayload } from '@libs/shared/types/src/optimizer';
import { CriteriaWeights } from '../utils/criteriaWeights';
import { TopsisNormalization } from '../utils/normalization/TopsisNormalization';
import { getCriteriaDirections } from '../utils/criteriaDirections';
import { getShopScore } from '../utils/shopScoreCalculator';

export function topsisRank(items: AlternativePayload[], weights: CriteriaWeights): AlternativePayload[] {
  if (!items || items.length === 0) {
    console.log('[topsisRank] Вхідний масив альтернатив порожній.');
    return [];
  }

  const criteriaKeys = Object.keys(weights) as (keyof CriteriaWeights)[];
  const directions = getCriteriaDirections();

  const matrix = items.map(item =>
      criteriaKeys.map(key => {
        if (key === 'shopScore') {
          return typeof item.shopScore === 'number' && !isNaN(item.shopScore)
              ? item.shopScore
              : getShopScore(item.shop);
        }
        const raw = item[key as keyof AlternativePayload];
        return typeof raw === 'number' && !isNaN(raw) ? raw : 0;
      })
  );
  console.log('\n[TOPSIS] \ud83d\udccc Крок 1: Матриця прийняття рішень');
  console.table(matrix);

  const normalizer = new TopsisNormalization();
  const normalizedMatrix = normalizer.normalize(matrix);
  const displayMatrix = normalizedMatrix.map(row => row.map(v => Number(v.toFixed(2))));
  console.log('\n[TOPSIS] \ud83d\udccc Крок 2: Нормалізована матриця');
  console.table(displayMatrix);

  const weightedMatrix = normalizedMatrix.map(row =>
      row.map((val, j) => val * weights[criteriaKeys[j]])
  );
  console.log('\n[TOPSIS] \ud83d\udccc Крок 3: Зважена матриця');
  const displayWeightedMatrix = weightedMatrix.map(row => row.map(v => Number(v.toFixed(2))));
  console.table(displayWeightedMatrix);

  const ideal = criteriaKeys.map((k, j) => {
    const values = weightedMatrix.map(r => r[j]);
    return directions[k] === 'max' ? Math.max(...values) : Math.min(...values);
  });
  const antiIdeal = criteriaKeys.map((k, j) => {
    const values = weightedMatrix.map(r => r[j]);
    return directions[k] === 'max' ? Math.min(...values) : Math.max(...values);
  });
  console.log('\n[TOPSIS] \ud83d\udccc Крок 4: Ідеальне (PIS) та антиідеальне (NIS) рішення');
  console.log('PIS:', ideal);
  console.log('NIS:', antiIdeal);

  const dPlusArray = weightedMatrix.map(row =>
      Math.sqrt(row.reduce((sum, val, j) => sum + Math.pow(val - ideal[j], 2), 0))
  );
  const dMinusArray = weightedMatrix.map(row =>
      Math.sqrt(row.reduce((sum, val, j) => sum + Math.pow(val - antiIdeal[j], 2), 0))
  );
  console.log('\n[TOPSIS] \ud83d\udccc Крок 5: Відстані до PIS (d+) та NIS (d-)');
  console.table({ dPlusArray, dMinusArray });

  const scores = dPlusArray.map((dPlus, i) => {
    const dMinus = dMinusArray[i];
    return dPlus + dMinus === 0 ? 0.5 : dMinus / (dPlus + dMinus);
  });
  console.log('\n[TOPSIS] \ud83d\udccc Крок 6: TOPSIS score');
  console.table(scores);

  const result = items.map((item, i) => ({ ...item, score: scores[i] }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  console.log('\n[TOPSIS] \ud83d\udccc Крок 7: Відсортовані альтернативи');
  console.table(result.map(r => ({
    shop: r.shop,
    score: r.score?.toFixed(4)
  })));

  return result;
}
