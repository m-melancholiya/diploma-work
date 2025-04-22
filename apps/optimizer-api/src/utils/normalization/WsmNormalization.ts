import { NormalizationStrategy } from '../../interfaces/NormalizationStrategy';
import { getCriteriaDirections } from '../criteriaDirections';

export class WsmNormalization implements NormalizationStrategy {
  normalize(matrix: number[][]): number[][] {
    const directions = getCriteriaDirections();
    const numCriteria = matrix[0].length;

    return matrix.map((row, i) =>
      row.map((val, j) => {
        const col = matrix.map(r => r[j]);
        const dir = directions[Object.keys(directions)[j]];
        const max = Math.max(...col);
        const min = Math.min(...col);
        return dir === 'min'
          ? (max - val) / (max - min || 1)
          : (val - min) / (max - min || 1);
      })
    );
  }
}