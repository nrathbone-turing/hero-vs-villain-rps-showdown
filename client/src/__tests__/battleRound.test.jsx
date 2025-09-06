// battleRound.test.jsx
import React from "react"
import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Battle from "../pages/Battle"
import { decideRPSChoice } from "../utils/rpsLogic"

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
    vi.spyOn(require("../utils/rpsLogic"), "decideRPSChoice")
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
    vi.spyOn(require("../utils/rpsLogic"), "decideRPSChoice")
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
})