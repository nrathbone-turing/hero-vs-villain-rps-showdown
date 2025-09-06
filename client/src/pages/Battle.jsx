// Battle.jsx
// Displays the selected hero vs a random opponent and resolves best-of-3 RPS rounds.

import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Grid, Card, CardContent, CardMedia, Typography, Button } from "@mui/material"
import { decideRPSChoice } from "../utils/rpsLogic"

function Battle() {
  const location = useLocation()
  const hero = location.state?.hero
  const [opponent, setOpponent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // round state
  const [round, setRound] = useState(1)
  const [heroScore, setHeroScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [winner, setWinner] = useState(null)

  useEffect(() => {
    async function loadOpponent() {
      try {
        const response = await fetch("/api/popular-heroes")
        if (!response.ok) throw new Error("Network error")

        const data = await response.json()
        const candidates = data.filter((h) => h.id !== hero?.id)
        const random = candidates[Math.floor(Math.random() * candidates.length)]
        setOpponent(random)
      } catch (err) {
        setError("Error fetching opponent")
      } finally {
        setLoading(false)
      }
    }

    if (hero) loadOpponent()
  }, [hero])

  function handlePlayRound() {
    if (!hero || !opponent || winner) return

    const heroChoice = decideRPSChoice(hero)
    const opponentChoice = decideRPSChoice(opponent)

    if (
      (heroChoice === "rock" && opponentChoice === "scissors") ||
      (heroChoice === "paper" && opponentChoice === "rock") ||
      (heroChoice === "scissors" && opponentChoice === "paper")
    ) {
      setHeroScore((prev) => prev + 1)
    } else if (heroChoice !== opponentChoice) {
      setOpponentScore((prev) => prev + 1)
    }

    setRound((prev) => prev + 1)

    // check for best-of-3
    if (heroScore + 1 === 2) {
      setWinner(hero.name)
    } else if (opponentScore + 1 === 2) {
      setWinner(opponent.name)
    }
  }

  if (!hero) {
    return <h2>No hero selected. Go back to Characters.</h2>
  }

  if (loading) return <p>Loading battle...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>Battle Page</h2>
      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
        {/* Selected Hero */}
        <Grid item xs={12} sm={6} md={5}>
          <Card data-testid="battle-card-hero">
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
            <Card data-testid="battle-card-opponent">
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

      {/* Scoreboard + round controls */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <Typography variant="h6">Round {round}</Typography>
        <Typography variant="body1">
          Score: {heroScore} - {opponentScore}
        </Typography>

        {!winner && (
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: 1 }}
            onClick={handlePlayRound}
          >
            Play Round
          </Button>
        )}

        {winner && (
          <Typography variant="h5" sx={{ marginTop: 2 }}>
            {winner} wins!
          </Typography>
        )}
      </div>
    </div>
  )
}

export default Battle