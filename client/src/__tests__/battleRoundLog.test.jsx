// battleRoundLog.test.jsx
// Tests for Battle log entries after playing rounds in Battle.jsx

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
      .mockReturnValueOnce("rock")     // hero choice
      .mockReturnValueOnce("scissors") // opponent choice

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    const playButton = await screen.findByTestId("play-round-btn")
    fireEvent.click(playButton)

    expect(await screen.findByTestId("round-1-heading")).toHaveTextContent("Round 1")
    expect(screen.getByTestId("round-1-choices")).toHaveTextContent("Superman chose rock, Batman chose scissors")
    expect(screen.getByTestId("round-1-outcome")).toHaveTextContent("Superman wins")
  })

  test("appends multiple rounds to the log", async () => {
    vi.spyOn(rpsLogic, "decideRPSChoice")
      .mockReturnValueOnce("rock").mockReturnValueOnce("scissors") // Round 1
      .mockReturnValueOnce("paper").mockReturnValueOnce("rock")    // Round 2

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

    expect(await screen.findByTestId("round-1-choices")).toHaveTextContent("Superman chose rock, Batman chose scissors")
    expect(screen.getByTestId("round-2-choices")).toHaveTextContent("Superman chose paper, Batman chose rock")
  })
})
