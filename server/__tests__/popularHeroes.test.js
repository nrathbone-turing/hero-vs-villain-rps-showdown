// server/__tests__/popularHeroes.test.js
// Tests the /api/popular-heroes endpoint

import request from 'supertest'
import app from '../index.js'

describe("GET /api/popular-heroes", () => {
  it("responds with a list of heroes", async () => {
    const res = await request(app).get('/api/popular-heroes')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it("each hero has id, name, and full powerstats", async () => {
    const res = await request(app).get('/api/popular-heroes')
    const hero = res.body[0]

    expect(hero).toHaveProperty("id")
    expect(hero).toHaveProperty("name")
    expect(hero).toHaveProperty("powerstats")

    // check all six stats exist
    expect(hero.powerstats).toHaveProperty("intelligence")
    expect(hero.powerstats).toHaveProperty("strength")
    expect(hero.powerstats).toHaveProperty("speed")
    expect(hero.powerstats).toHaveProperty("durability")
    expect(hero.powerstats).toHaveProperty("power")
    expect(hero.powerstats).toHaveProperty("combat")
  })
})