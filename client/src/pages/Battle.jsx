// Battle.jsx
// Displays the selected hero vs a random opponent from /api/popular-heroes.

import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Grid, Card, CardContent, CardMedia, Typography } from "@mui/material"

function Battle() {
  const location = useLocation()
  const hero = location.state?.hero
  const [opponent, setOpponent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadOpponent() {
      try {
        const response = await fetch("/api/popular-heroes")
        if (!response.ok) throw new Error("Network error")

        const data = await response.json()
        // Pick a random opponent that isn’t the selected hero
        const candidates = data.filter((h) => h.id !== hero?.id)
        const random = candidates[Math.floor(Math.random() * candidates.length)]
        setOpponent(random)
      } catch (err) {
        setError("Error fetching opponent")
      } finally {
        setLoading(false)
      }
    }

    if (hero) {
      loadOpponent()
    }
  }, [hero])

  if (!hero) {
    return <h2>No hero selected. Go back to Characters.</h2>
  }

  if (loading) return <p>Loading battle...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>Battle Page</h2>
      <Grid container spacing={2} justifyContent="center">
        {/* Selected Hero */}
        <Grid item xs={12} sm={6} md={5}>
          <Card>
            {hero.image && (
              <CardMedia component="img" height="200" image={hero.image} alt={hero.name} />
            )}
            <CardContent>
              <Typography variant="h6">Selected Hero: {hero.name}</Typography>
              <Typography variant="body2">Strength: {hero.powerstats.strength}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Opponent */}
        {opponent && (
          <Grid item xs={12} sm={6} md={5}>
            <Card>
              {opponent.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={opponent.image}
                  alt={opponent.name}
                />
              )}
              <CardContent>
                <Typography variant="h6">Opponent: {opponent.name}</Typography>
                <Typography variant="body2">
                  Strength: {opponent.powerstats.strength}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default Battle