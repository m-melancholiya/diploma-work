import { topsisRank } from '../src/services/topsis';
import { Alternative } from '../../../libs/shared/types/src/optimizer';
import { getWeightsForMode } from '../src/utils/criteriaWeights';
import chalk from 'chalk';

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

const mode = 'cheapest';
const weights = getWeightsForMode(mode);

console.log(chalk.blueBright(`\n💡 Ваги для режиму "${mode}":`), weights);

console.log(chalk.green('\n📦 Вхідні альтернативи:'));
items.forEach(item => {
  console.log(` - ${item.id} (${item.shop}): ціна=${item.price}, знижка=${item.discount}, доставка=${item.deliveryTime} год`);
});

const ranked = topsisRank(items, weights);

console.log(chalk.yellow('\n📊 Результати ранжування (TOPSIS):'));
ranked.forEach((item, i) => {
  console.log(`#${i + 1} [score=${item.score?.toFixed(4)}] ${item.id} (${item.shop})`);
});