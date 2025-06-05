import { describe, it, expect } from 'vitest'
import { wsmRank } from '../wsm'

describe('wsmRank()', () => {
    // Arrange: Визначення тестових альтернатив та вагових коефіцієнтів
    const alts = [
        { id: 'a', price: 100, deliveryTime: 60, shopScore: 5 },
        { id: 'b', price: 200, deliveryTime: 30, shopScore: 4 }
    ] as any;

    const weights = { price: 0.7, deliveryTime: 0.15, shopScore: 0.15 };

    it('ранжує найдешевший першим', () => {
        // Act: Виклик функції wsmRank з підготовленими даними
        const ranked = wsmRank(alts, weights);

        // Assert: Перевірка, що альтернатива 'a' (найдешевша) стоїть на першому місці
        expect(ranked[0].id).toBe('a');
        expect(ranked[1].id).toBe('b');
    });
});


