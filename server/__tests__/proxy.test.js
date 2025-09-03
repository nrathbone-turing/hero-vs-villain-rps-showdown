// proxy.test.js
// Tests for Express proxy server

import request from 'supertest'
import { describe, test, expect } from 'vitest'
import app from '../index.js'

describe("Server proxy", () => {
    test("responds to health check", async () => {
        const res = await request(app).get('/')
        expect(res.status).toBe(200)
        expect(res.text).toContain("API Proxy running")
    })

    test("fetches hero data from API", async () => {
        // Mock fetch
        global.fetch = async () => ({
        ok: true,
        json: async () => ({ name: "Mock Hero", powerstats: { strength: "99" } }),
        })

        const res = await request(app).get('/api/hero/1')
        expect(res.status).toBe(200)
        expect(res.body.name).toBe("Mock Hero")
        expect(res.body.powerstats.strength).toBe("99")
    })
})