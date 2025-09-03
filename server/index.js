// server/index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())

const PORT = process.env.PORT || 5001;
const API_KEY = process.env.API_KEY

console.log("Loaded API_KEY:", API_KEY ? API_KEY.slice(0, 5) + "..." : "undefined")

// Health check
app.get('/', (req, res) => {
  res.send('API Proxy running')
})

// Proxy route with debug logging
app.get('/api/hero/:id', async (req, res) => {
  try {
    const { id } = req.params
    const url = `https://superheroapi.com/api/${API_KEY}/${id}`
    console.log("Fetching:", url)

    const response = await fetch(url)

    console.log("SuperHero API response status:", response.status)
    const text = await response.text()
    console.log("SuperHero API raw body:", text)

    if (!response.ok) {
      return res.status(response.status).send(text)
    }

    const data = JSON.parse(text)
    res.json(data)
  } catch (error) {
    console.error("Proxy error:", error.message)
    res.status(500).json({ error: "Failed to fetch hero data" })
  }
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app