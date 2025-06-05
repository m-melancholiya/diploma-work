import request from 'supertest'
import { describe, it, expect, vi } from 'vitest'
import { createApp } from '../../setup'
import * as pricesService from '../../services/fetchPrices'

const app = createApp()

describe('POST /prices/by-eans', () => {
    it('400 если нет eans или пустой массив', async () => {
        let res = await request(app).post('/prices/by-eans').send({})
        expect(res.status).toBe(400)
        res = await request(app).post('/prices/by-eans').send({ eans: [] })
        expect(res.status).toBe(400)
    })

    it('500 при ошибке fetchPrices', async () => {
        vi.spyOn(pricesService, 'fetchPrices').mockRejectedValueOnce(new Error())
        const res = await request(app)
            .post('/prices/by-eans')
            .send({ eans: ['123'] })
        expect(res.status).toBe(500)
    })

    it('200 и дедуплицированные альтернативы', async () => {
        vi.spyOn(pricesService, 'fetchPrices')
            .mockResolvedValueOnce([{ chainId:'c1',storeId:'s1',ean:'a',price:10 }])
            .mockResolvedValueOnce([{ chainId:'c2',storeId:'s2',ean:'b',price:20 }])

        const res = await request(app)
            .post('/prices/by-eans')
            .send({ eans: ['a','b'] })
        expect(res.status).toBe(200)
        expect(res.body.alternatives).toHaveLength(2)
    })
})
