import { describe, it, expect } from 'vitest'
import { topsisRank } from '../topsis'

describe('topsisRank()', () => {
    const alts = [
        { id: 'x', price: 100, deliveryTime: 60, shopScore: 5 },
        { id: 'y', price: 200, deliveryTime: 30, shopScore: 4 }
    ] as any

    const weights = { price: 0.7, deliveryTime: 0.15, shopScore: 0.15 }

    it('обчислює score і повертає відсортований масив', () => {
        const ranked = topsisRank(alts, weights)
        expect(ranked[0].id).toBe('x')
        expect(ranked[0].score).toBeGreaterThan(ranked[1].score!)
    })
})
