// Home.jsx
// Polished home page with centered content

import React from "react"
import { Container, Typography, Box, Button } from "@mui/material"
import { Link } from "react-router-dom"

function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 6, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        🦸 Welcome to Hero vs Villain Showdown 🦹
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Choose your favorite hero, face off against a random hero or villain opponent,
        and battle it out in a best-of-3 Rock–Paper–Scissors contest!
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={Link}
          to="/characters"
          data-testid="get-started-btn"
        >
          Get Started
        </Button>
      </Box>
    </Container>
  )
}

export default Home