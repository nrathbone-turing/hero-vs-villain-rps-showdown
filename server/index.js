import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'

const app = express()
app.use(cors())

const PORT = process.env.PORT || 5000
const API_KEY = process.env.API_KEY

app.get('/', (req, res) => {
  res.send('API Proxy running')
})

// Proxy route
app.get('/api/hero/:id', async (req, res) => {
  try {
    const { id } = req.params
    const response = await fetch(`https://superheroapi.com/api/${API_KEY}/${id}`)
    if (!response.ok) throw new Error("Failed to fetch hero")
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hero data" })
  }
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app