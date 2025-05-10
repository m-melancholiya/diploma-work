import axios from 'axios';
import { StorePrice } from '../types/zakaz';

/**
 * Отримання цін товару в різних магазинах + прогноз доставки
 * 
 * @param productEan EAN товару
 * @param clientCoords Координати користувача у форматі "lat,lon" (опціонально)
 * @returns Массив цін у магазинах
 */
export async function fetchPrices(productEan: string, clientCoords?: string): Promise<StorePrice[]> {
  const query = `
    query ProductRetailerCards(
      $storeIds: [String!]!,
      $productEan: String!,
      $deliveryMethod: String!,
      $clientCoords: String,
      $clientSettlementId: String,
      $productTags: [String!]!
    ) {
      uberProducts {
        details(ean: $productEan, storeIds: $storeIds, storesAvailable: true) {
          mainEan
          stores {
            chainId
            storeId
            available
            price
            ean
          }
        }
      }
      deliverySchedules {
        nearest(
          nearestAcrossChain: true
          storeIds: $storeIds
          deliveryMethod: $deliveryMethod
          clientCoords: $clientCoords
          clientSettlementId: $clientSettlementId
          slotTypes: ["open"]
          productTags: $productTags
        ) {
          chainId
          slot {
            timeRange
          }
        }
      }
    }
  `;

  const variables = {
    storeIds: [
      '48201070', '48215611', '48221130', '48225531', '48231001', '482320001',
      '48246401', '482550001', '48267602', '48277601', '482778001', '482779001',
      '482800245', '482917587', '482918001'
    ],
    productEan,
    deliveryMethod: 'plan',
    clientCoords: clientCoords || '', // тепер якщо координати є, передаємо їх
    clientSettlementId: null,
    productTags: []
  };

  const payload = {
    operationName: 'ProductRetailerCards',
    query,
    variables
  };

  console.log('📦 Payload being sent:\n', JSON.stringify(payload, null, 2));

  try {
    const res = await axios.post('https://stores-api.zakaz.ua/graphql', payload, {
      headers: {
        'content-type': 'application/json',
        'origin': 'https://zakaz.ua',
        'referer': 'https://zakaz.ua/',
        'user-agent': 'Mozilla/5.0',
        'x-version': '63'
      }
    });

    const stores = res.data?.data?.uberProducts?.details?.stores ?? [];
    const deliverySchedules = res.data?.data?.deliverySchedules?.nearest ?? [];

    const deliveryMap: Record<string, string | null> = {};
    for (const d of deliverySchedules) {
      deliveryMap[d.chainId] = d.slot?.timeRange || null;
    }

    return stores.map((s: any): StorePrice => ({
      chainId: s.chainId,
      storeId: s.storeId,
      available: s.available,
      price: s.price,
      ean: s.ean,
      deliveryTimeRange: deliveryMap[s.chainId] ?? null
    }));
  } catch (err) {
    console.error(`❌ Error fetching prices for EAN ${productEan}:`, err);
    return [];
  }
}