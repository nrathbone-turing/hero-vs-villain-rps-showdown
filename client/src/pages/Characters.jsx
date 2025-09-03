// Characters.jsx
// Fetches and displays a single hero with power stats.

import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography } from '@mui/material'

function Characters({ heroId = 1 }) {
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchHero() {
      try {
        const response = await fetch(
          `https://superheroapi.com/api/${import.meta.env.VITE_API_KEY}/${heroId}`
        )
        if (!response.ok) throw new Error("Network response was not ok")
        const data = await response.json()
        setHero(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHero()
  }, [heroId])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error fetching hero</p>

  return (
    <Card sx={{ maxWidth: 345, margin: '1rem auto' }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {hero.name}
        </Typography>
        <Typography variant="body1">
          Strength: {hero.powerstats.strength}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Characters