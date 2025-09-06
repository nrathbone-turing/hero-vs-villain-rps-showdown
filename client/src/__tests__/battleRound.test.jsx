// battleRound.test.jsx
import React from "react"
import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Battle from "../pages/Battle"
import * as rpsLogic from "../utils/rpsLogic"

const mockHero = { id: 70, name: "Batman", image: "batman.jpg", powerstats: {} }
const mockOpponent = { id: 644, name: "Superman", image: "superman.jpg", powerstats: {} }

beforeEach(() => {
  // Mock API fetch for opponents
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [mockHero, mockOpponent],
  })
})

describe("Battle round resolution", () => {
  test("shows initial scoreboard and round number", async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText(/Round 1/i)).toBeInTheDocument()
    expect(screen.getByText(/Score: 0 - 0/i)).toBeInTheDocument()
  })

  test("increments hero score when hero wins round", async () => {
    vi.spyOn(rpsLogic, "decideRPSChoice")
        .mockReturnValueOnce("rock") // hero
        .mockReturnValueOnce("scissors") // opponent

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(await screen.findByRole("button", { name: /play round/i }))

    expect(await screen.findByText(/Score: 1 - 0/i)).toBeInTheDocument()
  })

  test("declares winner after best-of-3", async () => {
    vi.spyOn(rpsLogic, "decideRPSChoice")
        .mockReturnValueOnce("rock").mockReturnValueOnce("scissors") // hero win
        .mockReturnValueOnce("rock").mockReturnValueOnce("scissors") // hero win

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(await screen.findByRole("button", { name: /play round/i }))
    fireEvent.click(await screen.findByRole("button", { name: /play round/i }))

    expect(await screen.findByText(/Batman wins!/i)).toBeInTheDocument()
  })

  test("handles multiple draws before declaring a winner", async () => {
    // 3 draws, then hero wins twice
    vi.spyOn(rpsLogic, "decideRPSChoice")
      .mockReturnValueOnce("rock").mockReturnValueOnce("rock")       // draw
      .mockReturnValueOnce("paper").mockReturnValueOnce("paper")     // draw
      .mockReturnValueOnce("scissors").mockReturnValueOnce("scissors") // draw
      .mockReturnValueOnce("rock").mockReturnValueOnce("scissors")   // hero win
      .mockReturnValueOnce("rock").mockReturnValueOnce("scissors")   // hero win

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    // play 5 rounds (3 draws + 2 wins)
    fireEvent.click(await screen.findByRole("button", { name: /play round/i }))
    fireEvent.click(await screen.findByRole("button", { name: /play round/i }))
    fireEvent.click(await screen.findByRole("button", { name: /play round/i }))
    fireEvent.click(await screen.findByRole("button", { name: /play round/i }))
    fireEvent.click(await screen.findByRole("button", { name: /play round/i }))

    // Hero should win after reaching 2 wins despite multiple draws
    expect(await screen.findByText(/Batman wins!/i)).toBeInTheDocument()

    // Score should reflect exactly 2 - 0 (draws didn’t increment)
    expect(screen.getByText(/Score: 2 - 0/i)).toBeInTheDocument()
  })

  test("does not advance round counter after winner is declared", async () => {
    vi.spyOn(rpsLogic, "decideRPSChoice")
      .mockReturnValueOnce("rock").mockReturnValueOnce("scissors") // hero win
      .mockReturnValueOnce("rock").mockReturnValueOnce("scissors") // hero win → Batman wins

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    // play two winning rounds
    fireEvent.click(await screen.findByRole("button", { name: /play round/i }))
    fireEvent.click(await screen.findByRole("button", { name: /play round/i }))

    // confirm winner is declared
    expect(await screen.findByText(/Batman wins!/i)).toBeInTheDocument()

    // round counter should stay at 2 (not advance to 3)
    expect(screen.getByTestId("round-counter")).toHaveTextContent("Round 2")
  })
})