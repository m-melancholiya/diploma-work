import request from 'supertest'
import { describe, it, expect, beforeAll } from 'vitest'
import express from 'express'
import optimizerRouter from '../optimizer'

const app = express()
app.use(express.json())
app.use('/optimizer-api', optimizerRouter)

describe('POST /optimize (integration)', () => {
    it('повертає 400, якщо items порожній', async () => {
        const res = await request(app)
            .post('/optimizer-api/optimize')
            .send({ items: [], mode: { name:'best_price', rankingMethod:'wsm' } })
        expect(res.status).toBe(400)
        expect(res.body.error).toMatch(/порожній або відсутній/)
    })

    it('успішно оптимізує простий кошик', async () => {
        const payload = {
            items: [
                { productId:'p1', alternatives: [
                        { id:'a1', productId:'p1', ean:'x', price:100, available:true, shop:'s1', slug:'foo' }
                    ]}
            ],
            mode: { name:'best_price', rankingMethod:'wsm' },
            maxBudget: 200
        }
        const res = await request(app)
            .post('/optimizer-api/optimize')
            .send(payload)

        expect(res.status).toBe(200)
        expect(res.body.selectedItems).toHaveLength(1)
        expect(res.body.selectedItems[0].id).toBe('a1')
        expect(res.body.totalPrice).toBe(100)
    })
})
