import { NormalizationStrategy } from '../../interfaces/NormalizationStrategy';

export class TopsisNormalization implements NormalizationStrategy {
  normalize(matrix: number[][]): number[][] {
    const numCriteria = matrix[0].length;
    const colSums = Array(numCriteria).fill(0).map((_, j) =>
      Math.sqrt(matrix.reduce((sum, row) => sum + Math.pow(row[j], 2), 0))
    );

    return matrix.map(row =>
      row.map((val, j) => (colSums[j] === 0 ? 0 : val / colSums[j]))
    );
  }
}