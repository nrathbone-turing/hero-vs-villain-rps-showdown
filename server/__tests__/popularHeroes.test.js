// server/__tests__/popularHeroes.test.js
import request from 'supertest'
import app from '../index.js'

describe('GET /api/popular-heroes', () => {
  it('responds with a list of heroes', async () => {
    const res = await request(app).get('/api/popular-heroes')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)

    // Check that it has at least 1 hero
    expect(res.body.length).toBeGreaterThan(0)

    // Check the shape of a hero object
    expect(res.body[0]).toHaveProperty('id')
    expect(res.body[0]).toHaveProperty('name')
    expect(res.body[0]).toHaveProperty('powerstats')
  })
})