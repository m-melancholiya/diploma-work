import { Router } from 'express';
import { topsisRank } from '../services/topsis';
import { wsmRank } from '../services/wsm';
import { solveGreedy } from '../services/greedySolver';
import { getWeightsForMode } from '../utils/criteriaWeights';
import {
  AlternativePayload,
  OptimizationRequestPayload,
  OptimizationResponsePayload,
} from '@libs/shared/types/src/optimizer';

const router = Router();

router.post('/optimize', (req, res) => {
  try {
    const { items, mode, maxBudget, clientCoords } = req.body as OptimizationRequestPayload;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('[API /optimize] Помилка: Масив товарів (items) порожній або відсутній.');
      return res.status(400).json({ error: 'Масив товарів (items) порожній або відсутній.' });
    }

    const weights = getWeightsForMode(mode.name);
    console.log('[API /optimize] Використовуються ваги критеріїв:', weights);

    const bestAlternativeForEachProduct: AlternativePayload[][] = [];

    // Етап 1: Ранжування альтернатив для кожного товару
    for (const product of items) {
      if (!product.alternatives || product.alternatives.length === 0) {
        console.log(`[API /optimize] Для товару ${product.productId} (${product.title || 'Без назви'}) немає альтернатив. Пропускаємо.`);
        bestAlternativeForEachProduct.push([]);
        continue;
      }

      let rankedProductAlternatives: AlternativePayload[];
      if (mode.rankingMethod === 'topsis') {
        rankedProductAlternatives = topsisRank(product.alternatives, weights);
      } else {
        rankedProductAlternatives = wsmRank(product.alternatives, weights);
      }

      if (rankedProductAlternatives.length > 0) {
        bestAlternativeForEachProduct.push([rankedProductAlternatives[0]]);
        console.log(
            `[API /optimize] Найкраща альтернатива для ${product.title || product.productId}: ` +
            `ID ${rankedProductAlternatives[0].id}, EAN ${rankedProductAlternatives[0].ean}, ` +
            `Score: ${rankedProductAlternatives[0].score?.toFixed(4)}`
        );
      } else {
        bestAlternativeForEachProduct.push([]);
        console.log(`[API /optimize] Не знайдено ранжованих альтернатив для ${product.title || product.productId}`);
      }
    }

    // Етап 2: Формування кошика жадібним алгоритмом
    console.log('[API /optimize] Запуск жадібного алгоритму...');
    const { selectedAlternatives, totalPrice } = solveGreedy(
        bestAlternativeForEachProduct,
        maxBudget
    );

    // Додаємо готові посилання на Zakaz.ua
    const selectedItemsWithUrls = selectedAlternatives.map((alt: AlternativePayload) => ({
      ...alt,
      zakazUrl: `https://zakaz.ua/uk/products/${alt.slug}--${alt.ean}`
    }));

    const response: OptimizationResponsePayload = {
      selectedItems: selectedItemsWithUrls,
      totalPrice,
    };

    console.log('[API /optimize] Відповідь:', response);
    res.json(response);

  } catch (error: any) {
    console.error('❌ [API /optimize] Критична помилка під час оптимізації:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера при оптимізації', details: error.message });
  }
});

export default router;
