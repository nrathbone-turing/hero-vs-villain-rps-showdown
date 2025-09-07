// BattleLayout.test.jsx
// Tests for Battle page UI layout with hero vs opponent using data-testid.

import React from "react"
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Battle from "../pages/Battle"
import * as rpsLogic from "../utils/rpsLogic"

const mockHero = {
  id: 70,
  name: "Batman",
  image: "batman.jpg",
  powerstats: { strength: "50" },
}

const mockOpponent = {
  id: 644,
  name: "Superman",
  image: "superman.jpg",
  powerstats: { strength: "1000" },
}

beforeEach(() => {
  // Mock API
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [mockHero, mockOpponent],
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

/** Helper: hero wins two rounds (best-of-3 ends 2-0)
 * call order in component is: hero, opponent, hero, opponent, ...
 */
function stubHeroWinsTwoRounds() {
  vi.spyOn(rpsLogic, "decideRPSChoice")
    // Round 1: hero rock beats opponent scissors
    .mockReturnValueOnce("rock")      // hero
    .mockReturnValueOnce("scissors")  // opponent
    // Round 2: hero paper beats opponent rock
    .mockReturnValueOnce("paper")     // hero
    .mockReturnValueOnce("rock")      // opponent
}

describe("Battle page layout", () => {
  test("renders both hero and opponent cards", async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByTestId("battle-card-hero")).toBeInTheDocument()
    expect(await screen.findByTestId("battle-card-opponent")).toBeInTheDocument()
  })

  test("shows fallback if no hero selected", () => {
    render(
      <MemoryRouter initialEntries={["/battle"]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(/no hero selected/i)).toBeInTheDocument()
  })

  test("renders round counter and score", async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByTestId("round-counter")).toHaveTextContent("Round 1")
    expect(screen.getByTestId("score-display")).toHaveTextContent("Score: 0 - 0")
  })

  test("appends entries to battle log after playing rounds", async () => {
    // deterministic first round (hero wins)
    vi.spyOn(rpsLogic, "decideRPSChoice")
      .mockReturnValueOnce("rock")      // hero
      .mockReturnValueOnce("scissors")  // opponent

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    const playButton = await screen.findByTestId("play-round-btn")
    fireEvent.click(playButton)

    expect(await screen.findByTestId("round-1-heading")).toBeInTheDocument()
    expect(screen.getByTestId("round-1-choices")).toBeInTheDocument()
    expect(screen.getByTestId("round-1-outcome")).toBeInTheDocument()
  })

  test("shows winner message after best of 3", async () => {
    stubHeroWinsTwoRounds()

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    const playButton = await screen.findByTestId("play-round-btn")
    fireEvent.click(playButton)
    fireEvent.click(playButton)

    expect(await screen.findByTestId("winner-message")).toBeInTheDocument()
  })

  test("play again resets the game", async () => {
    stubHeroWinsTwoRounds()

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    const playButton = await screen.findByTestId("play-round-btn")
    fireEvent.click(playButton)
    fireEvent.click(playButton)

    const playAgain = await screen.findByTestId("play-again-btn")
    fireEvent.click(playAgain)

    expect(await screen.findByTestId("round-counter")).toHaveTextContent("Round 1")
    expect(screen.getByTestId("score-display")).toHaveTextContent("Score: 0 - 0")
  })

  test("pick new character button is rendered after winner", async () => {
    stubHeroWinsTwoRounds()

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    const playButton = await screen.findByTestId("play-round-btn")
    fireEvent.click(playButton)
    fireEvent.click(playButton)

    await waitFor(() => {
      expect(screen.getByTestId("pick-new-btn")).toBeInTheDocument()
    })
  })

  test("battle log container is rendered", async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByTestId("battle-log")).toBeInTheDocument()
  })
})