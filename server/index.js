// server/index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())

const PORT = process.env.PORT || 5001
const API_KEY = process.env.API_KEY

// Health check
app.get('/', (req, res) => {
  res.send('API Proxy running')
})

// Proxy route
app.get('/api/hero/:id', async (req, res) => {
  try {
    const { id } = req.params
    const url = `https://superheroapi.com/api/${API_KEY}/${id}`

    const response = await fetch(url)
    if (!response.ok) {
      return res.status(response.status).send(await response.text())
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error("Proxy error:", error.message)
    res.status(500).json({ error: "Failed to fetch hero data" })
  }
})

// Temporary static heroes for list endpoint
const staticHeroes = [
  { id: 70, name: "Batman", powerstats: { strength: "50" } },
  { id: 644, name: "Superman", powerstats: { strength: "100" } },
  { id: 720, name: "Wonder Woman", powerstats: { strength: "85" } },
  { id: 620, name: "Spider-Man", powerstats: { strength: "55" } },
]

// Popular heroes endpoint (stub)
app.get('/api/popular-heroes', (req, res) => {
  res.json(staticHeroes)
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app