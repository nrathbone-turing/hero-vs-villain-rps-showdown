// battleRetry.test.jsx
// Tests for "Play Again" and "Pick New Character" buttons in Battle.jsx

import React from "react"
import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Battle from "../pages/Battle"
import Characters from "../pages/Characters"
import * as rpsLogic from "../utils/rpsLogic"

const mockHero = { id: 70, name: "Batman", image: "batman.jpg", powerstats: {} }
const mockOpponent = { id: 644, name: "Superman", image: "superman.jpg", powerstats: {} }

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [mockHero, mockOpponent],
  })
})

describe("Battle retry options", () => {
  test("shows Play Again button after winner is declared", async () => {
    vi.spyOn(rpsLogic, "decideRPSChoice")
      .mockReturnValueOnce("rock").mockReturnValueOnce("scissors") // hero win
      .mockReturnValueOnce("rock").mockReturnValueOnce("scissors") // hero win again

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(await screen.findByTestId("play-round-btn"))
    fireEvent.click(await screen.findByTestId("play-round-btn"))

    expect(await screen.findByTestId("play-again-btn")).toBeInTheDocument()
  })

  test("shows Pick New Character button after winner is declared", async () => {
    vi.spyOn(rpsLogic, "decideRPSChoice")
      .mockReturnValueOnce("rock").mockReturnValueOnce("scissors")
      .mockReturnValueOnce("rock").mockReturnValueOnce("scissors")

    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}
      >
        <Routes>
          <Route path="/battle" element={<Battle />} />
          <Route path="/characters" element={<Characters />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(await screen.findByTestId("play-round-btn"))
    fireEvent.click(await screen.findByTestId("play-round-btn"))

    expect(await screen.findByTestId("pick-new-btn")).toBeInTheDocument()
  })

  test("shows both retry options after winner is declared", async () => {
    vi.spyOn(rpsLogic, "decideRPSChoice")
      .mockReturnValueOnce("rock").mockReturnValueOnce("scissors")
      .mockReturnValueOnce("rock").mockReturnValueOnce("scissors")

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(await screen.findByTestId("play-round-btn"))
    fireEvent.click(await screen.findByTestId("play-round-btn"))

    expect(await screen.findByTestId("play-again-btn")).toBeInTheDocument()
    expect(await screen.findByTestId("pick-new-btn")).toBeInTheDocument()

  })
})
