// server/index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

const app = express()
app.use(cors())

const PORT = process.env.PORT || 5000
const API_KEY = process.env.API_KEY

// Mask key in logs
console.log("Loaded API_KEY:", API_KEY ? API_KEY.slice(0, 5) + "..." : "undefined")

// Health check
app.get('/', (_req, res) => {
  res.send('API Proxy running')
})

// Proxy route for hero by ID
app.get('/api/hero/:id', async (req, res) => {
  try {
    const { id } = req.params
    const url = `https://superheroapi.com/api/${API_KEY}/${id}`
    console.log("Fetching:", url)

    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })

    res.status(response.status).json(response.data)
  } catch (err) {
    if (err.response) {
      console.error('Upstream error:', err.response.status, err.response.data)
      return res.status(err.response.status).json(err.response.data)
    }
    console.error('Proxy error:', err.message)
    res.status(500).json({ error: "Failed to fetch hero data" })
  }
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app