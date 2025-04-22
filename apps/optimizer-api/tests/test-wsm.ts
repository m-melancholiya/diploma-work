import { wsmRank } from '../src/services/wsm';
import { Alternative } from '../src/types/optimizer';
import { getWeightsForMode } from '../src/utils/criteriaWeights';

const items: Alternative[] = [
    {
      id: 'novus-a1',
      productId: 'apple',
      price: 85,
      discount: 0.1,
      deliveryTime: 12,
      shop: 'novus',
    },
    {
      id: 'auchan-a1',
      productId: 'apple',
      price: 90,
      discount: 0.15,
      deliveryTime: 24,
      shop: 'auchan',
    },
    {
      id: 'metro-a1',
      productId: 'apple',
      price: 80,
      discount: 0.05,
      deliveryTime: 48,
      shop: 'metro',
    },
    {
      id: 'novus-a2',
      productId: 'apple',
      price: 95,
      discount: 0.2,
      deliveryTime: 18,
      shop: 'novus',
    },
    {
      id: 'tavriav-a1',
      productId: 'apple',
      price: 70,
      discount: 0.05,
      deliveryTime: 36,
      shop: 'tavriav',
    },
  ];

// Вибір режиму
const weights = getWeightsForMode('cheapest');

console.log('\n📋 Вхідні дані:');
items.forEach(a => {
  console.log(`${a.id}: ціна = ${a.price}, знижка = ${a.discount}, доставка = ${a.deliveryTime}`);
});

console.log('\n⚖️ Ваги критеріїв:', weights);

// Виклик алгоритму
const ranked = wsmRank(items, weights);

console.log('\n📊 Результати ранжування (WSM):');
ranked.forEach((item, idx) => {
  console.log(`#${idx + 1} [score=${item.score?.toFixed(4)}] ${item.id}`);
});