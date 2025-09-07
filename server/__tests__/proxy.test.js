// proxy.test.js
import request from "supertest"
import { vi, describe, test, expect, beforeEach } from "vitest"

// mock node-fetch directly
vi.mock("node-fetch", () => ({
  default: vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({
        name: "Mock Hero",
        powerstats: { strength: "99" },
      }),
      text: async () =>
        JSON.stringify({
          name: "Mock Hero",
          powerstats: { strength: "99" },
        }),
    })
  ),
}))

import app from "../index.js" // import AFTER the mock

describe("Server proxy", () => {
  test("responds to health check", async () => {
    const res = await request(app).get("/")
    expect(res.status).toBe(200)
    expect(res.text).toContain("API Proxy running")
  })

  test("fetches hero data from API", async () => {
    const res = await request(app).get("/api/hero/1")
    expect(res.status).toBe(200)
    expect(res.body.name).toBe("Mock Hero")
    expect(res.body.powerstats.strength).toBe("99")
  })
})
