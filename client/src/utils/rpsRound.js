// client/src/utils/rpsRound.js
// Resolves a Rock–Paper–Scissors round between hero and opponent.

import { decideRPSChoice } from "./rpsLogic"

export function resolveRound(hero, opponent) {
  const heroMove = decideRPSChoice(hero)
  const opponentMove = decideRPSChoice(opponent)

  let winner = "tie"

  if (
    (heroMove === "rock" && opponentMove === "scissors") ||
    (heroMove === "scissors" && opponentMove === "paper") ||
    (heroMove === "paper" && opponentMove === "rock")
  ) {
    winner = "hero"
  } else if (
    (opponentMove === "rock" && heroMove === "scissors") ||
    (opponentMove === "scissors" && heroMove === "paper") ||
    (opponentMove === "paper" && heroMove === "rock")
  ) {
    winner = "opponent"
  }

  return { heroMove, opponentMove, winner }
}