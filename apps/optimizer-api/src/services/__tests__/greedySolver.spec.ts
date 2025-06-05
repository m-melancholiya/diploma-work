import { describe, it, expect } from 'vitest'
import { solveGreedy } from '../greedySolver'

describe('solveGreedy()', () => {
    it('обирає першу доступну альтернативу та не перевищує бюджет', () => {
        const alts = [
            [ { id:'a', price: 100 } ],
            [ { id:'b', price: 200 } ],
            [ { id:'c', price: 50 } ]
        ] as any
        const { selectedAlternatives, totalPrice } = solveGreedy(alts, 150)
        // Очікуємо, що оберіться 'a' (100), потім 'c' (50)
        expect(selectedAlternatives.map(x => x.id)).toEqual(['a','c'])
        expect(totalPrice).toBe(150)
    })
})
