// BattleLayout.test.jsx
// Tests for Battle page UI layout with hero vs opponent.

import React from "react"
import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Battle from "../pages/Battle"

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
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [mockHero, mockOpponent],
  })
})

describe("Battle page layout", () => {
  test("renders both hero and opponent cards", async () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}
      >
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    // Hero shows up
    await waitFor(() => {
      expect(screen.getByText(/Batman/i)).toBeInTheDocument()
    })

    // Opponent shows up
    await waitFor(() => {
      expect(screen.getByText(/Superman/i)).toBeInTheDocument()
    })
  })

  test("displays hero and opponent side by side", async () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}
      >
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    // Find both battle cards by testid
    const heroCard = await screen.findByTestId("battle-card-hero")
    const opponentCard = await screen.findByTestId("battle-card-opponent")

    expect(heroCard).toBeInTheDocument()
    expect(opponentCard).toBeInTheDocument()
  })

  test("shows fallback if no hero selected", () => {
    render(
      <MemoryRouter initialEntries={["/battle"]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    expect(
      screen.getByText(/no hero selected/i)
    ).toBeInTheDocument()
  })
})