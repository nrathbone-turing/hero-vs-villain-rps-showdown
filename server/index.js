// server/index.js
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import fetch from "node-fetch"
import { popularHeroes } from "./api/popularHeroes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load env specifically from server/.env
dotenv.config({ path: path.resolve(__dirname, ".env") })

const app = express()
app.use(cors())

const PORT = process.env.PORT || 5001
const API_KEY = process.env.API_KEY

console.log(`[server] API_KEY ${API_KEY ? "loaded" : "MISSING"}`)

// 🔹 Utility to normalize hero objects
function normalizeHero(data) {
  return {
    id: Number(data.id),
    name: data.name,
    image: data.image?.url || data.image || "", // handles API + static
    powerstats: data.powerstats || {},
  }
}

// Health check
app.get("/", (_req, res) => {
  res.send("API Proxy running")
})

// Proxy a single hero (normalized)
app.get("/api/hero/:id", async (req, res) => {
  try {
    const { id } = req.params
    if (!API_KEY) return res.status(500).json({ error: "Missing API_KEY" })

    const url = `https://superheroapi.com/api/${API_KEY}/${id}`
    const r = await fetch(url)
    const text = await r.text()
    if (!r.ok) return res.status(r.status).send(text)

    const data = JSON.parse(text)
    return res.json(normalizeHero(data))
  } catch (err) {
    console.error("[server] /api/hero error:", err)
    return res.status(500).json({ error: "Failed to fetch hero" })
  }
})

// Popular heroes (normalized)
app.get("/api/popular-heroes", async (_req, res) => {
  const ids = [70, 644, 720, 620]

  if (!API_KEY) {
    console.warn("[server] Missing API_KEY, serving static popularHeroes")
    return res.json(popularHeroes.map(normalizeHero))
  }

  try {
    const results = await Promise.allSettled(
      ids.map(async (id) => {
        const url = `https://superheroapi.com/api/${API_KEY}/${id}`
        const r = await fetch(url)
        const data = await r.json()
        return normalizeHero(data)
      })
    )

    const live = results
      .filter((r) => r.status === "fulfilled" && r.value?.name)
      .map((r) => r.value)

    if (live.length === ids.length) return res.json(live)

    console.warn("[server] Some API calls failed — mixing in static fallbacks")
    const got = new Set(live.map((h) => h.id))
    const missingFromStatic = popularHeroes
      .filter((h) => !got.has(h.id))
      .map(normalizeHero)

    return res.json([...live, ...missingFromStatic])
  } catch (err) {
    console.error("[server] /api/popular-heroes error:", err)
    return res.json(popularHeroes.map(normalizeHero))
  }
})

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`)
  })
}

export default app
