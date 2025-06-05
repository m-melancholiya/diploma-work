import { OptimizationModeName } from '@libs/shared/types/src/optimizer';
import { CriteriaKeys } from './criteriaDirections';

export type CriteriaWeights = Record<keyof CriteriaKeys, number>;

export function getWeightsForMode(mode: OptimizationModeName): CriteriaWeights {
    console.log(`[getWeightsForMode] Отримано режим: ${mode}`);
    switch (mode) {
        case OptimizationModeName.BEST_PRICE:
            return { price: 0.7, deliveryTime: 0.15, shopScore: 0.15 };

        case OptimizationModeName.FASTEST_DELIVERY:
            return { price: 0.15, deliveryTime: 0.7, shopScore: 0.15 };

        case OptimizationModeName.BALANCED:
            return { price: 0.34, deliveryTime: 0.33, shopScore: 0.33 };

        case OptimizationModeName.BEST_SHOP_RATING:
            return { price: 0.15, deliveryTime: 0.15, shopScore: 0.7 };

        default:
            console.warn(`[getWeightsForMode] Невідомий режим: ${mode}. Використовується 'balanced'`);
            return { price: 0.34, deliveryTime: 0.33, shopScore: 0.33 };
    }
}