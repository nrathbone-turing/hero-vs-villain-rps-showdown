// Characters.jsx
// Displays a list of popular heroes with full powerstats, image, and Select buttons.

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardMedia, Typography, Button, Grid, Container } from "@mui/material"
import { useNavigate } from "react-router-dom"

function Characters() {
  const [heroes, setHeroes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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
    <Container sx={{ mt: 4 }}>
      {/* Page heading for tests and accessibility */}
      <Typography
        variant="h4"
        align="center"
        sx={{ mt: 2, mb: 3, fontWeight: "bold" }}
        data-testid="characters-heading"
      >
        Characters
      </Typography>

      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
        {heroes.map((hero) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={hero.id}>
            <Card data-testid={`hero-card-${hero.id}`} sx={{ maxWidth: 300, margin: "auto" }}>
              {/* Hero image */}
              {hero.image && (
                <CardMedia
                  component="img"
                  sx={{ height: 250, objectFit: "cover" }} // enforce consistent height and cropping
                  image={hero.image}
                  alt={hero.name}
                />
              )}
              <CardContent>
                <Typography variant="h6" component="h3">
                  {hero.name}
                </Typography>
                {hero.powerstats && (
                  <>
                    <Typography variant="body2">Intelligence: {hero.powerstats.intelligence}</Typography>
                    <Typography variant="body2">Strength: {hero.powerstats.strength}</Typography>
                    <Typography variant="body2">Speed: {hero.powerstats.speed}</Typography>
                    <Typography variant="body2">Durability: {hero.powerstats.durability}</Typography>
                    <Typography variant="body2">Power: {hero.powerstats.power}</Typography>
                    <Typography variant="body2">Combat: {hero.powerstats.combat}</Typography>
                  </>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 1 }}
                  aria-label={`select ${hero.name.toLowerCase()}`}
                  onClick={() => navigate("/battle", { state: { hero } })}
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Characters