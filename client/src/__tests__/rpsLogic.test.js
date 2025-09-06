// client/src/__tests__/rpsLogic.test.js
// Unit tests for decideRPSChoice helper that maps hero stats --> RPS choice

import { describe, test, expect, vi } from "vitest"
import { decideRPSChoice } from "../utils/rpsLogic"

describe("decideRPSChoice", () => {
  test("returns 'rock' when strength/durability dominate", () => {
    const hero = {
      powerstats: {
        strength: "100",
        durability: "90",
        intelligence: "10",
        power: "10",
        speed: "10",
        combat: "10",
      },
    }
    vi.spyOn(Math, "random").mockReturnValue(0.1) // force into rock range
    expect(decideRPSChoice(hero)).toBe("rock")
    Math.random.mockRestore()
  })

  test("returns 'paper' when intelligence/power dominate", () => {
    const hero = {
      powerstats: {
        intelligence: "95",
        power: "90",
        strength: "10",
        durability: "10",
        speed: "10",
        combat: "10",
      },
    }
    vi.spyOn(Math, "random").mockReturnValue(0.4) // force into paper range
    expect(decideRPSChoice(hero)).toBe("paper")
    Math.random.mockRestore()
  })

  test("returns 'scissors' when speed/combat dominate", () => {
    const hero = {
      powerstats: {
        speed: "100",
        combat: "90",
        strength: "10",
        durability: "10",
        intelligence: "10",
        power: "10",
      },
    }
    vi.spyOn(Math, "random").mockReturnValue(0.8) // force into scissors range
    expect(decideRPSChoice(hero)).toBe("scissors")
    Math.random.mockRestore()
  })

  test("defaults to equal odds if stats are missing", () => {
    const hero = { powerstats: {} }
    const result = decideRPSChoice(hero)
    expect(["rock", "paper", "scissors"]).toContain(result)
  })
})