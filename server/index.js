// server/index.js
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import fetch from "node-fetch"
import { popularHeroes } from "./api/popularHeroes.js"

dotenv.config({ path: path.resolve("server/.env") })
console.log("Loaded API_KEY:", process.env.API_KEY)


const app = express()
app.use(cors())

const PORT = process.env.PORT || 5001
const API_KEY = process.env.API_KEY

// Health check
app.get("/", (req, res) => {
  res.send("API Proxy running")
})

// Proxy: fetch a single hero by ID
app.get("/api/hero/:id", async (req, res) => {
  try {
    const { id } = req.params
    const url = `https://superheroapi.com/api/${API_KEY}/${id}`

    const response = await fetch(url)
    if (!response.ok) throw new Error("API request failed")

    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error("Proxy error:", error.message)
    res.status(500).json({ error: "Failed to fetch hero data" })
  }
})

// Popular heroes: try live API, else fallback to static
app.get("/api/popular-heroes", async (req, res) => {
  const heroIds = [70, 644, 720, 620] // Batman, Superman, Wonder Woman, Spider-Man

  try {
    if (!API_KEY) throw new Error("Missing API_KEY")

    const requests = heroIds.map((id) =>
      fetch(`https://superheroapi.com/api/${API_KEY}/${id}`).then((r) => r.json())
    )
    const heroes = await Promise.all(requests)

    // if response looks valid, return live data
    if (heroes && heroes.length) {
      return res.json(heroes)
    }

    throw new Error("Empty response from API")
  } catch (error) {
    console.warn("Falling back to static heroes:", error.message)
    res.json(popularHeroes) // fallback
  }
})

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app