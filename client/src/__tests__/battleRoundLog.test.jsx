// battleRoundLog.test.jsx
import React from "react"
import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Battle from "../pages/Battle"
import * as rpsLogic from "../utils/rpsLogic"

const mockHero = { id: 70, name: "Superman", image: "superman.jpg", powerstats: {} }
const mockOpponent = { id: 71, name: "Batman", image: "batman.jpg", powerstats: {} }

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [mockHero, mockOpponent],
  })
})

describe("Battle round log", () => {
  test("displays log entry after playing a round", async () => {
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

    const playButton = await screen.findByRole("button", { name: /play round/i })
    fireEvent.click(playButton)

    expect(await screen.findByText(/Superman chose rock/i)).toBeInTheDocument()
    expect(screen.getByText(/Batman chose scissors/i)).toBeInTheDocument()
    expect(screen.getByText(/→ Superman wins/i)).toBeInTheDocument()
  })

  test("appends multiple rounds to the log", async () => {
    vi.spyOn(rpsLogic, "decideRPSChoice")
      .mockReturnValueOnce("rock").mockReturnValueOnce("scissors") // Round 1
      .mockReturnValueOnce("paper").mockReturnValueOnce("rock") // Round 2

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    const playButton = await screen.findByRole("button", { name: /play round/i })
    fireEvent.click(playButton)
    fireEvent.click(playButton)

    expect(await screen.findByText(/Round 1: Superman chose rock, Batman chose scissors/i)).toBeInTheDocument()
    expect(screen.getByText(/Round 2: Superman chose paper, Batman chose rock/i)).toBeInTheDocument()
  })
})