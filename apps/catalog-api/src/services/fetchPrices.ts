import axios from 'axios';
import { StorePrice } from '../types/zakaz';

/**
 * Парсить дату та часовий діапазон від Zakaz.ua і розраховує час до початку слоту в хвилинах.
 * @param dateStr Рядок дати (наприклад, "2025-05-11")
 * @param timeRangeStr Рядок часового діапазону (наприклад, "16:00 - 17:00")
 * @returns Кількість хвилин від поточного моменту до початку слоту доставки, або undefined.
 */
function parseDeliverySlot(dateStr?: string, timeRangeStr?: string): number | undefined {
  if (!dateStr || !timeRangeStr) {
    // Якщо немає дати або часу, не можемо розрахувати.
    // Можна повернути велике значення за замовчуванням, якщо потрібно,
    // щоб такі альтернативи мали низький пріоритет за часом доставки.
    // Наприклад: return 24 * 60 * 7; // Умовний тиждень
    return undefined;
  }

  try {
    // Витягуємо час початку слоту
    const timeMatch = timeRangeStr.match(/(\d{1,2}):(\d{2})/);
    if (!timeMatch) {
      console.warn(`[parseDeliverySlot] Не вдалося розпарсити час з timeRange: "${timeRangeStr}"`);
      return undefined;
    }

    const startHour = parseInt(timeMatch[1], 10);
    const startMinute = parseInt(timeMatch[2], 10);

    // Створюємо об'єкт Date для початку слоту доставки
    // Важливо: Date(dateStr) може по-різному інтерпретувати дату залежно від формату та часового поясу сервера.
    // Краще явно вказати компоненти дати.
    const dateParts = dateStr.split('-');
    if (dateParts.length !== 3) {
      console.warn(`[parseDeliverySlot] Некоректний формат дати: "${dateStr}"`);
      return undefined;
    }
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Місяці в JS Date від 0 до 11
    const day = parseInt(dateParts[2], 10);

    const deliveryStartDateTime = new Date(year, month, day, startHour, startMinute, 0, 0);

    // Перевірка на валідність створеної дати
    if (isNaN(deliveryStartDateTime.getTime())) {
      console.warn(`[parseDeliverySlot] Невалідний об'єкт Date створено для: ${dateStr} ${timeRangeStr}`);
      return undefined;
    }

    const now = new Date();
    const diffMs = deliveryStartDateTime.getTime() - now.getTime();

    // Якщо слот вже минув, можливо, це помилка або дані застаріли.
    // Повертаємо велике значення або 0, залежно від бажаної логіки.
    // Для критерію "чим менше, тим краще", минулий слот не є добрим.
    if (diffMs < 0) {
      console.warn(`[parseDeliverySlot] Слот доставки ${dateStr} ${timeRangeStr} вже минув відносно ${now.toISOString()}.`);
      // Можна повернути дуже велике значення, щоб знизити пріоритет
      // return Number.MAX_SAFE_INTEGER;
      return undefined; // Або undefined, якщо такі слоти не розглядаються
    }

    return Math.round(diffMs / 60000); // Кількість хвилин до початку слоту
  } catch (error) {
    console.error(`[parseDeliverySlot] Помилка парсингу дати/часу: "${dateStr}", "${timeRangeStr}"`, error);
    return undefined;
  }
}


export async function fetchPrices(productEan: string, clientCoords?: string): Promise<StorePrice[]> {
  console.log(`[fetchPrices] Starting for EAN: ${productEan}, Coords: ${clientCoords || 'N/A'}`);
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
          slot { # Додаємо поле date для отримання дати слоту
            date 
            timeRange
          }
        }
      }
    }
  `;

  const variables = {
    storeIds: [
      "482779003", "48246401", "482918001", "48225531", "482800245",
      "482917587", "482676003", "48215633", "482010105", "482776003",
      "482550001", "482778003"
    ],
    productEan,
    deliveryMethod: 'plan',
    clientCoords: clientCoords || undefined,
    clientSettlementId: null,
    productTags: []
  };

  const payload = {
    operationName: 'ProductRetailerCards',
    query,
    variables
  };

  console.log(`[DEBUG-GraphQL-Payload] EAN: ${productEan}\n`, JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post('https://stores-api.zakaz.ua/graphql', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://zakaz.ua',
        'Referer': 'https://zakaz.ua',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Version': '63'
      },
      timeout: 15000
    });

    console.log(`[DEBUG-ZakazAPI-Response] EAN: ${productEan}, Status: ${response.status}\nData:`, JSON.stringify(response.data, null, 2));

    const storesData = response.data?.data?.uberProducts?.details?.stores ?? [];
    const deliverySchedulesData = response.data?.data?.deliverySchedules?.nearest ?? [];

    console.log(`[DEBUG-Extracted-Stores] EAN: ${productEan}, Count: ${storesData.length}`, storesData.length > 0 ? storesData[0] : 'No stores data');
    console.log(`[DEBUG-Extracted-Schedules] EAN: ${productEan}, Count: ${deliverySchedulesData.length}`, deliverySchedulesData.length > 0 ? deliverySchedulesData[0] : 'No schedules data');

    // Створюємо мапу для швидкого пошуку даних про доставку за chainId
    const deliveryInfoMap: Record<string, { date?: string, timeRange?: string }> = {};
    for (const schedule of deliverySchedulesData) {
      if (schedule.chainId) {
        deliveryInfoMap[schedule.chainId] = {
          date: schedule.slot?.date,
          timeRange: schedule.slot?.timeRange
        };
      }
    }

    const mappedResult = storesData.map((store: any): StorePrice => {
      const deliverySlotData = deliveryInfoMap[store.chainId];
      const deliveryTimeMinutes = parseDeliverySlot(deliverySlotData?.date, deliverySlotData?.timeRange);

      return {
        chainId: store.chainId,
        storeId: store.storeId,
        available: store.available,
        price: store.price,
        ean: store.ean,
        deliveryTimeRange: deliverySlotData?.timeRange || null, // Зберігаємо оригінальний рядок для інформації
        deliveryTimeMinutes: deliveryTimeMinutes // Додаємо розрахований числовий час
      };
    });

    console.log(`[DEBUG-Mapped-Result] EAN: ${productEan}, Count: ${mappedResult.length}`, mappedResult.length > 0 ? mappedResult[0] : 'No mapped results');
    return mappedResult;

  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error(`❌ Axios error fetching prices for EAN ${productEan}: ${err.message}`, err.response?.status, err.response?.data);
    } else {
      console.error(`❌ Generic error fetching prices for EAN ${productEan}:`, err);
    }
    return [];
  }
}