import { fetchPrices } from '../src/services/fetchPrices';

const main = async () => {
  const ean = '04820061500563';
  const prices = await fetchPrices(ean);
  console.log(JSON.stringify(prices, null, 2));
};

main();