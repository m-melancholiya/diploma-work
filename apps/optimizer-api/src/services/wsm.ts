import { Alternative } from '../types/optimizer';
import { CriteriaWeights } from '../utils/criteriaWeights';
import { getCriteriaDirections } from '../utils/criteriaDirections';

/**
 * Реалізація методу простої вагової суми (WSM)
 * Кроки згідно методички:
 * 1. Побудова матриці прийняття рішень
 * 2. Нормалізація:
 *    - max: value / max(col)
 *    - min: min(col) / value
 * 3. Зважена нормалізована матриця
 * 4. Сума рядків та сортування
 */
export function wsmRank(items: Alternative[], weights: CriteriaWeights): Alternative[] {
  const criteriaKeys = Object.keys(weights) as (keyof CriteriaWeights)[];
  const directions = getCriteriaDirections();

  // Крок 1: Матриця прийняття рішень
  const matrix = items.map(item =>
    criteriaKeys.map(k => (item[k] ?? 0) as number)
  );
  console.log('\n📌 Крок 1: Матриця прийняття рішень');
  console.table(matrix);

  // Підготовка мінімуму та максимуму по стовпцях
  const colMax = criteriaKeys.map((_, j) => Math.max(...matrix.map(row => row[j])));
  const colMin = criteriaKeys.map((_, j) => Math.min(...matrix.map(row => row[j])));
  
  // Крок 2: Нормалізована матриця
  const normMatrix = matrix.map(row =>
    row.map((val, j) => {
      if (directions[criteriaKeys[j]] === 'max') {
        return colMax[j] === 0 ? 0 : val / colMax[j];
      } else {
        // мінімізувати: min(col) / value
        return val === 0 ? 0 : colMin[j] / val;
      }
    })
  );
  console.log('\n📌 Крок 2: Нормалізована матриця');
  console.table(normMatrix);

  // Крок 3: Зважена нормалізована матриця
  const weightedMatrix = normMatrix.map(row =>
    row.map((val, j) => val * weights[criteriaKeys[j]])
  );
  console.log('\n📌 Крок 3: Зважена нормалізована матриця');
  console.table(weightedMatrix);

  // Крок 4: Сума рядків => score
  const scores = weightedMatrix.map(row =>
    row.reduce((sum, val) => sum + val, 0)
  );
  console.log('\n📌 Крок 4: Розрахунок WSM score (сума зважених значень)');
  console.table(scores);

  // Сортування альтернатив за score
  console.log('\n📌 Крок 5: Відсортовані альтернативи за WSM score');
  const result = items
    .map((item, i) => ({ ...item, score: scores[i] }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  console.table(result.map(r => ({ id: r.id, score: r.score })));  

  return result;
}
