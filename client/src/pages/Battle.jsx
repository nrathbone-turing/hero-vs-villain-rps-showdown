// Battle.jsx
// Displays the selected hero vs a random opponent and resolves best-of-3 RPS rounds.

import React, { useEffect, useState, useRef } from "react"
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

  const logRef = useRef(null)

  // scroll battle log to bottom on update
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [log])

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
    let result = "draw"

    if (
      (heroChoice === "rock" && opponentChoice === "scissors") ||
      (heroChoice === "paper" && opponentChoice === "rock") ||
      (heroChoice === "scissors" && opponentChoice === "paper")
    ) {
      newHeroScore++
      result = "hero"
    } else if (heroChoice !== opponentChoice) {
      newOpponentScore++
      result = "villain"
    }

    // Add to log
    const entry = {
      summary: `${hero.name} chose ${heroChoice}, ${opponent.name} chose ${opponentChoice}`,
      result,
    }
    setLog((prev) => [...prev, entry])

    // Update scores
    setHeroScore(newHeroScore)
    setOpponentScore(newOpponentScore)

    // Check winner
    if (newHeroScore === 2 || newOpponentScore === 2) {
      setWinner(newHeroScore === 2 ? hero.name : opponent.name)
    } else {
      setRound((prev) => prev + 1)
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

  if (!hero) return <h2>No hero selected. Return to Characters and choose your hero!</h2>
  if (loading) return <p>Loading battle...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      {/* Page heading for tests and accessibility */}
      <Typography
        variant="h4"
        align="center"
        sx={{ mt: 2, mb: 3, fontWeight: "bold" }}
        data-testid="battle-heading"
      >
        Battle Page
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 2 }}>
        {/* Left placeholder */}
        <Grid item xs={12} md={3}></Grid>

        {/* Center: Hero + Opponent */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} justifyContent="center">
            {/* Hero card */}
            <Grid item xs={12} sm={6}>
              <Card data-testid="battle-card-hero" sx={{ width: 320, mx: "auto" }}>
                <CardMedia
                  component="img"
                  sx={{ height: 325, objectFit: "cover", width: "100%" }}
                  image={hero.image}
                  alt={hero.name}
                />
                <CardContent>
                  <Typography variant="h6" data-testid="hero-name">
                    <span style={{ color: "green", fontWeight: "bold" }}>Hero:</span> {hero.name}
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
                </CardContent>
              </Card>
            </Grid>

            {/* Opponent card */}
            {opponent && (
              <Grid item xs={12} sm={6}>
                <Card data-testid="battle-card-opponent" sx={{ width: 320, mx: "auto" }}>
                  <CardMedia
                    component="img"
                    sx={{ height: 325, objectFit: "cover", width: "100%" }}
                    image={opponent.image}
                    alt={opponent.name}
                  />
                  <CardContent>
                    <Typography variant="h6" data-testid="opponent-name">
                      <span style={{ color: "red", fontWeight: "bold" }}>Villain:</span> {opponent.name}
                    </Typography>
                    {opponent.powerstats && (
                      <>
                        <Typography variant="body2">Intelligence: {opponent.powerstats.intelligence}</Typography>
                        <Typography variant="body2">Strength: {opponent.powerstats.strength}</Typography>
                        <Typography variant="body2">Speed: {opponent.powerstats.speed}</Typography>
                        <Typography variant="body2">Durability: {opponent.powerstats.durability}</Typography>
                        <Typography variant="body2">Power: {opponent.powerstats.power}</Typography>
                        <Typography variant="body2">Combat: {opponent.powerstats.combat}</Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Right: Scoreboard + Log */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, maxWidth: 280, mx: "auto", minHeight: 550 }}>
            <Typography variant="h6" data-testid="round-counter">
              Round {round}
            </Typography>
            <Typography variant="body1" data-testid="score-display" sx={{ mb: 2 }}>
              Score: {heroScore} - {opponentScore}
            </Typography>

            {!winner && (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handlePlayRound}
                data-testid="play-round-btn"
              >
                Play Round
              </Button>
            )}

            {winner && (
              <>
                <Typography
                  variant="h5"
                  data-testid="winner-message"
                  sx={{ mt: 2, fontWeight: "bold", color: "green" }}
                >
                  {winner} wins!
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={handlePlayAgain}
                  data-testid="play-again-btn"
                >
                  Play Again
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => navigate("/characters")}
                  data-testid="pick-new-btn"
                >
                  Pick New Character
                </Button>
              </>
            )}

            <Typography variant="h6" sx={{ mt: 3 }}>
              Battle Log
            </Typography>
            <div
              ref={logRef}
              data-testid="battle-log"
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "0.5rem",
                marginTop: "0.5rem",
                backgroundColor: "#fafafa",
              }}
            >
              {log.length === 0 ? (
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  No rounds yet — click Play Round to begin!
                </Typography>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {log.map((entry, idx) => (
                    <li key={idx} style={{ marginBottom: "0.75rem" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold" }}
                        data-testid={`round-${idx + 1}-heading`}
                      >
                        Round {idx + 1}
                      </Typography>
                      <Typography
                        variant="body2"
                        data-testid={`round-${idx + 1}-choices`}
                      >
                        {entry.summary}
                      </Typography>
                      <Typography
                        variant="body2"
                        data-testid={`round-${idx + 1}-outcome`}
                        sx={{
                          color:
                            entry.result === "hero"
                              ? "green"
                              : entry.result === "villain"
                              ? "red"
                              : "gray",
                        }}
                      >
                        {entry.result === "draw"
                          ? "Draw"
                          : entry.result === "hero"
                          ? `🦸 ${hero.name} wins 🦸`
                          : `🦹 ${opponent.name} wins 🦹`}
                      </Typography>
                      <hr style={{ margin: "6px 0", border: "0.5px solid #eee" }} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default Battle
