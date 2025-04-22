import { Alternative } from '../types/optimizer';
import { CriteriaWeights } from '../utils/criteriaWeights';
import { TopsisNormalization } from '../utils/normalization/TopsisNormalization';
import { getCriteriaDirections } from '../utils/criteriaDirections';

export function topsisRank(items: Alternative[], weights: CriteriaWeights): Alternative[] {
  const criteriaKeys = Object.keys(weights) as (keyof CriteriaWeights)[];
  const directions = getCriteriaDirections();

  // Крок 1: Побудова матриці прийняття рішень
  const matrix = items.map(item =>
    criteriaKeys.map(k => (item[k] ?? 0) as number)
  );
  console.log('\n📌 Крок 1: Матриця прийняття рішень');
  console.table(matrix);

  // Крок 2: Нормалізація
  const normalizer = new TopsisNormalization();
  const normalizedMatrix = normalizer.normalize(matrix);
  console.log('\n📌 Крок 2: Нормалізована матриця');
  console.table(normalizedMatrix);

  // Крок 3: Помноження на ваги
  const weightedMatrix = normalizedMatrix.map(row =>
    row.map((val, j) => val * weights[criteriaKeys[j]])
  );
  console.log('\n📌 Крок 3: Зважена матриця');
  console.table(weightedMatrix);

  // Крок 4: Пошук PIS (ідеальна) та NIS (антиідеальна) точок
  const ideal = criteriaKeys.map((k, j) => {
    const values = weightedMatrix.map(r => r[j]);
    return directions[k] === 'max' ? Math.max(...values) : Math.min(...values);
  });
  const antiIdeal = criteriaKeys.map((k, j) => {
    const values = weightedMatrix.map(r => r[j]);
    return directions[k] === 'max' ? Math.min(...values) : Math.max(...values);
  });
  console.log('\n📌 Крок 4: PIS (ідеальне рішення)');
  console.log(ideal);
  console.log('\n📌 Крок 4: NIS (антиідеальне рішення)');
  console.log(antiIdeal);

  // Крок 5: Обчислення евклідових відстаней (dPlus та dMinus)
  console.log('\n📌 Крок 5: Обчислення відстаней до PIS (dPlus) та NIS (dMinus)');
  const dPlusArray = weightedMatrix.map(row =>
    Math.sqrt(
      row.reduce((sum, val, j) => sum + Math.pow(val - ideal[j], 2), 0)
    )
  );
  console.log('dPlus:');
  console.table(dPlusArray);

  const dMinusArray = weightedMatrix.map(row =>
    Math.sqrt(
      row.reduce((sum, val, j) => sum + Math.pow(val - antiIdeal[j], 2), 0)
    )
  );
  console.log('dMinus:');
  console.table(dMinusArray);

  // Крок 6: Обчислення TOPSIS score
  console.log('\n📌 Крок 6: Розрахунок TOPSIS score');
  const scores = dPlusArray.map((dPlus, i) => {
    const dMinus = dMinusArray[i];
    return dPlus + dMinus === 0 ? 0 : dMinus / (dPlus + dMinus);
  });
  console.table(scores);

  // Крок 7: Сортування альтернатив за TOPSIS score
  console.log('\n📌 Крок 7: Відсортовані альтернативи за TOPSIS score');
  const result = items
    .map((item, i) => ({ ...item, score: scores[i] }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  console.table(result.map(r => ({ id: r.id, score: r.score })));

  return result;
}