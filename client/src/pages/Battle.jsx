// Battle.jsx
// Displays the selected hero vs a random opponent and resolves best-of-3 RPS rounds.

import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Grid, Card, CardContent, CardMedia, Typography, Button } from "@mui/material"
import { decideRPSChoice } from "../utils/rpsLogic"

function Battle() {
  const location = useLocation()
  const navigate = useNavigate()
  const hero = location.state?.hero
  const [opponent, setOpponent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // round state
  const [round, setRound] = useState(1)
  const [heroScore, setHeroScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [winner, setWinner] = useState(null)
  const [log, setLog] = useState([])

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

    let newHeroScore = heroScore
    let newOpponentScore = opponentScore
    let outcome = "Draw"

    if (
      (heroChoice === "rock" && opponentChoice === "scissors") ||
      (heroChoice === "paper" && opponentChoice === "rock") ||
      (heroChoice === "scissors" && opponentChoice === "paper")
    ) {
      newHeroScore++
      outcome = `${hero.name} wins`
    } else if (heroChoice !== opponentChoice) {
      newOpponentScore++
      outcome = `${opponent.name} wins`
    }

    // Add to log
    const entry = `Round ${round}: ${hero.name} chose ${heroChoice}, ${opponent.name} chose ${opponentChoice} → ${outcome}`
    setLog((prev) => [...prev, entry])

    // Update scores
    setHeroScore(newHeroScore)
    setOpponentScore(newOpponentScore)

    // Check for best-of-3 before incrementing round
    if (newHeroScore === 2) {
      setWinner(hero.name)
    } else if (newOpponentScore === 2) {
      setWinner(opponent.name)
    } else {
      setRound((prev) => prev + 1) // only advance counter if no winner
    }
  }

  function handlePlayAgain() {
    setRound(1)
    setHeroScore(0)
    setOpponentScore(0)
    setWinner(null)
    setLog([])

    async function rerollOpponent() {
      try {
        const response = await fetch("/api/popular-heroes")
        if (!response.ok) throw new Error("Network error")
        const data = await response.json()
        const candidates = data.filter((h) => h.id !== hero?.id)
        const random = candidates[Math.floor(Math.random() * candidates.length)]
        setOpponent(random)
      } catch (err) {
        setError("Error fetching opponent")
      }
    }
    rerollOpponent()
  }

  if (!hero) return <h2>No hero selected. Go back to Characters.</h2>
  if (loading) return <p>Loading battle...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h2>Battle Page</h2>
      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
        {/* Selected Hero */}
        <Grid xs={12} sm={6} md={5}>
          <Card data-testid="battle-card-hero" sx={{ width: 320, mx: "auto" }}>
            {hero.image && (
              <CardMedia
                component="img"
                sx={{ height: 325, objectFit: "cover", width: "100%" }}
                image={hero.image}
                alt={hero.name}
              />
            )}
            <CardContent>
              <Typography variant="h6">Selected Hero: {hero.name}</Typography>
              <Typography variant="body2">Strength: {hero.powerstats.strength}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Opponent */}
        {opponent && (
          <Grid xs={12} sm={6} md={5}>
            <Card data-testid="battle-card-opponent" sx={{ width: 320, mx: "auto" }}>
              {opponent.image && (
                <CardMedia
                  component="img"
                  sx={{ height: 325, objectFit: "cover", width: "100%" }}
                  image={opponent.image}
                  alt={opponent.name}
                />
              )}
              <CardContent>
                <Typography variant="h6">Opponent: {opponent.name}</Typography>
                <Typography variant="body2">Strength: {opponent.powerstats.strength}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Scoreboard + controls */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <Typography variant="h6" data-testid="round-counter">Round {round}</Typography>
        <Typography variant="body1">Score: {heroScore} - {opponentScore}</Typography>

        {!winner && (
          <Button variant="contained" color="secondary" sx={{ marginTop: 1 }} onClick={handlePlayRound}>
            Play Round
          </Button>
        )}

        {winner && (
          <div>
            <Typography variant="h5" sx={{ marginTop: 2 }}>{winner} wins!</Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: 1, marginRight: 1 }} onClick={handlePlayAgain}>
              Play Again
            </Button>
            <Button variant="outlined" color="secondary" sx={{ marginTop: 1 }} onClick={() => navigate("/characters")}>
              Pick New Character
            </Button>
          </div>
        )}
      </div>

      {/* Battle log */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <Typography variant="h6">Battle Log</Typography>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {log.map((entry, idx) => (
            <li key={idx}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Battle