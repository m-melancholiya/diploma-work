import { NormalizationStrategy } from '../../interfaces/NormalizationStrategy';
import { getCriteriaDirections, CriteriaDirections, CriteriaKeys } from '../criteriaDirections';

export class WsmNormalization implements NormalizationStrategy {
    normalize(matrix: number[][]): number[][] {
        if (matrix.length === 0 || (matrix.length > 0 && matrix[0].length === 0)) {
            console.log('[WsmNormalization] Вхідна матриця порожня або некоректна.');
            return [];
        }
        console.log('[WsmNormalization]  Вхідна матриця для нормалізації (метод value/max або min/value):', JSON.parse(JSON.stringify(matrix)));

        const directions = getCriteriaDirections();
        const criteriaOrder = Object.keys(directions) as Array<keyof CriteriaKeys>;

        const numCriteria = criteriaOrder.length;
        if (numCriteria === 0 || matrix[0].length !== numCriteria) {
            console.error('[WsmNormalization] Невідповідність кількості критеріїв у directions та матриці.');
            return matrix.map(row => [...row]);
        }

        // Знаходимо min/max для кожного стовпця (критерію)
        const minValues: number[] = new Array(numCriteria).fill(Infinity);
        const maxValues: number[] = new Array(numCriteria).fill(-Infinity);

        for (const row of matrix) {
            for (let j = 0; j < numCriteria; j++) {
                if (row[j] < minValues[j]) minValues[j] = row[j];
                if (row[j] > maxValues[j]) maxValues[j] = row[j];
            }
        }
        console.log('[WsmNormalization] Мін. значення по критеріях:', minValues);
        console.log('[WsmNormalization] Макс. значення по критеріях:', maxValues);

        const normalizedMatrix = matrix.map(row =>
            row.map((val, j) => {
                const criterionKey = criteriaOrder[j];
                const dir = directions[criterionKey];
                const max = maxValues[j];
                const min = minValues[j];

                if (dir === 'max') { // Критерії, що максимізуються (наприклад, рейтинг магазину)
                    // Формула: value / max_in_column
                    // Якщо max = 0 (всі значення нульові), то результат 0 (або 1, якщо всі альтернативи однаково "хороші")
                    return max === 0 ? (val === 0 ? 1 : 0) : val / max;
                } else { // Критерії, що мінімізуються (наприклад, ціна, час доставки)
                    // Формула: min_in_column / value
                    // Якщо val = 0 (наприклад, безкоштовна доставка), це ідеально. Щоб уникнути ділення на 0,
                    // і щоб результат був 1 (найкращий), обробляємо цей випадок.
                    // Якщо min = 0 і val = 0, то це найкращий випадок -> 1.
                    // Якщо min > 0 і val = 0, це помилка даних або нереалістична ситуація, але для уникнення ділення на 0 -> 1 (як найкраще).
                    // Якщо val > 0, використовуємо формулу.
                    if (val === 0) return 1; // Найкраще значення для критерію мінімізації
                    return min / val;
                }
            })
        );
        // Після цієї нормалізації, вище значення завжди краще для всіх критеріїв.
        const displayMatrix = normalizedMatrix.map(row => row.map(v => Number(v.toFixed(2))));
        console.log('[WsmNormalization] Нормалізована матриця (метод value/max або min/value, 1 - краще):');
        console.table(displayMatrix);

        return normalizedMatrix;
    }
}
