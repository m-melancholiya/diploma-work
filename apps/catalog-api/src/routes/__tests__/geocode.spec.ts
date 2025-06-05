import request from 'supertest'
import { describe, it, expect, vi } from 'vitest'
import { createApp } from '../../setup'
import * as geocodeService from '../../services/geocodeAddress'

const app = createApp()

describe('GET /geocode', () => {
    it('400 если нет ?address', async () => {
        const res = await request(app).get('/geocode')
        expect(res.status).toBe(400)
        expect(res.body.error).toMatch(/Missing \?address/)
    })

    it('404 если сервис вернул null', async () => {
        vi.spyOn(geocodeService, 'geocodeAddress').mockResolvedValueOnce(null)
        const res = await request(app).get('/geocode').query({ address: 'nowhere' })
        expect(res.status).toBe(404)
    })

    it('200 и coords если всё ок', async () => {
        vi.spyOn(geocodeService, 'geocodeAddress').mockResolvedValueOnce({ lat: 50, lng: 30 })
        const res = await request(app).get('/geocode').query({ address: 'Kyiv' })
        expect(res.status).toBe(200)
        expect(res.body).toEqual({ coords: { lat: 50, lng: 30 } })
    })
})
