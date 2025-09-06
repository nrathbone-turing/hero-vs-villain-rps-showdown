// client/src/__tests__/rpsRound.test.js
// Unit tests for resolveRound helper that decides RPS outcome between hero and opponent

import { describe, test, expect, vi, beforeEach } from "vitest"
import { resolveRound } from "../utils/rpsRound"
import * as rpsLogic from "../utils/rpsLogic"

const mockHero = { name: "Batman", powerstats: {} }
const mockOpponent = { name: "Superman", powerstats: {} }

describe("resolveRound", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  test("hero wins (rock beats scissors)", () => {
    vi.spyOn(rpsLogic, "decideRPSChoice")
      .mockImplementationOnce(() => "rock")     // hero move
      .mockImplementationOnce(() => "scissors") // opponent move

    const result = resolveRound(mockHero, mockOpponent)

    expect(result.heroMove).toBe("rock")
    expect(result.opponentMove).toBe("scissors")
    expect(result.winner).toBe("hero")
  })

  test("opponent wins (scissors beats paper)", () => {
    vi.spyOn(rpsLogic, "decideRPSChoice")
      .mockImplementationOnce(() => "paper")     // hero move
      .mockImplementationOnce(() => "scissors")  // opponent move

    const result = resolveRound(mockHero, mockOpponent)

    expect(result.heroMove).toBe("paper")
    expect(result.opponentMove).toBe("scissors")
    expect(result.winner).toBe("opponent")
  })

  test("tie when moves match", () => {
    vi.spyOn(rpsLogic, "decideRPSChoice")
      .mockImplementation(() => "rock")

    const result = resolveRound(mockHero, mockOpponent)

    expect(result.heroMove).toBe("rock")
    expect(result.opponentMove).toBe("rock")
    expect(result.winner).toBe("tie")
  })
})