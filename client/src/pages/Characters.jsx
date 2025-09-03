// Characters.jsx
// Displays a list of popular heroes with MUI Cards and Select buttons.
// Data is fetched from the Express API (`/api/popular-heroes`).

import React, { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Button, Grid } from '@mui/material'

function Characters() {
  const [heroes, setHeroes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadHeroes() {
      try {
        const response = await fetch("/api/popular-heroes")
        if (!response.ok) throw new Error("Network response was not ok")

        const data = await response.json()
        setHeroes(data)
      } catch (err) {
        setError("Error fetching heroes")
      } finally {
        setLoading(false)
      }
    }

    loadHeroes()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
      {heroes.map((hero) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={hero.id}>
          <Card data-testid={`hero-card-${hero.id}`} sx={{ maxWidth: 300, margin: 'auto' }}>
            <CardContent>
              <Typography variant="h6" component="h3">
                {hero.name}
              </Typography>
              <Typography variant="body2">
                Strength: {hero.powerstats.strength}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 1 }}
                aria-label={`select ${hero.name.toLowerCase()}`}
              >
                Select
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default Characters