// Characters.jsx
// Displays a list of popular heroes with full powerstats, image, and Select buttons.

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardMedia, Typography, Button, Grid, Container } from "@mui/material"
import { useNavigate } from "react-router-dom"

// Utility to capitalize the first letter of a word
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function Characters() {
  const [heroes, setHeroes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Load heroes from the server API
  useEffect(() => {
    async function loadHeroes() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/popular-heroes`)
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
            <Card
              data-testid={`hero-card-${hero.id}`}
              sx={{
                maxWidth: 300,
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                height: "100%", // expand vertically with content
              }}
            >
              {/* Hero image */}
              {hero.image && (
                <CardMedia
                  component="img"
                  sx={{ height: 250, objectFit: "cover" }} // consistent height for images
                  image={hero.image}
                  alt={hero.name}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Hero name */}
                <Typography variant="h6" component="h3">
                  {hero.name}
                </Typography>

                {/* Render all available stats dynamically, capitalized */}
                {hero.powerstats &&
                  Object.entries(hero.powerstats).map(([key, val]) => (
                    <Typography key={key} variant="body2">
                      {capitalize(key)}: {val}
                    </Typography>
                  ))}

                {/* Select button */}
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
