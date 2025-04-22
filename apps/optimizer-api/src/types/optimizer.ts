import { OptimizationModeName, RankingMethod } from '../utils/criteriaWeights';

export interface Alternative {
    id: string;
    productId: string;
    price: number;
    discount: number;
    deliveryTime: number;
    singleShopScore?: number;
    shop: string;
    score?: number;
  }

  /**
 * Режим оптимізації, який вибирає користувач
 */
export interface OptimizationMode {
    name: OptimizationModeName;      // напр. 'cheapest' | 'fastest' | ...
    rankingMethod: RankingMethod;    // 'topsis' | 'wsm'
  }
  
  /**
   * Тіло запиту POST /optimize
   */
  export interface OptimizationRequest {
    items: Alternative[];     // усі альтернативи по всіх товарах у кошику
    mode: OptimizationMode;    // режим оптимізації
  }
  
  /**
   * Відповідь сервісу /optimize
   */
  export interface OptimizationResponse {
    ranking: Alternative[];    // відсортовані альтернативи з score
    selectedItems: Alternative[]; // підмножина — обрані жадібним/іншим методом
  }