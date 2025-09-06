// client/src/utils/rpsLogic.js
// Decides a hero's Rock/Paper/Scissors choice based on weighted powerstats.

export function decideRPSChoice(hero) {
  const stats = hero?.powerstats || {}

  // Convert values safely to numbers, with a default of 0
  const strength = Number(stats.strength) || 0
  const durability = Number(stats.durability) || 0
  const intelligence = Number(stats.intelligence) || 0
  const power = Number(stats.power) || 0
  const speed = Number(stats.speed) || 0
  const combat = Number(stats.combat) || 0

  // Weight definitions
  const rockWeight = strength + durability
  const paperWeight = intelligence + power
  const scissorsWeight = speed + combat

  const total = rockWeight + paperWeight + scissorsWeight
    if (total === 0) {
        return ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)]
    } // fallback

  // Random roll across weighted ranges
  const roll = Math.random() * total
  if (roll < rockWeight) return "rock"
  if (roll < rockWeight + paperWeight) return "paper"
  return "scissors"
}