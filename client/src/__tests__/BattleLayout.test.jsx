// BattleLayout.test.jsx
// Tests for Battle page UI layout with hero vs opponent.

import React from "react"
import { describe, test, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Battle from "../pages/Battle"

const mockHero = {
  id: 70,
  name: "Batman",
  image: "batman.jpg",
  powerstats: {
    intelligence: "100",
    strength: "26",
    speed: "27",
    durability: "50",
    power: "47",
    combat: "100",
  },
}

const mockOpponent = {
  id: 644,
  name: "Superman",
  image: "superman.jpg",
  powerstats: {
    intelligence: "94",
    strength: "100",
    speed: "100",
    durability: "100",
    power: "100",
    combat: "85",
  },
}

describe("Battle page layout", () => {
  test("renders both hero and opponent cards", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero, opponent: mockOpponent } }]}>
        <Battle />
      </MemoryRouter>
    )

    expect(screen.getByText(/Batman/i)).toBeInTheDocument()
    expect(screen.getByText(/Superman/i)).toBeInTheDocument()
  })

  test("displays hero and opponent side by side", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero, opponent: mockOpponent } }]}>
        <Battle />
      </MemoryRouter>
    )

    const cards = screen.getAllByTestId(/battle-card/i)
    expect(cards).toHaveLength(2)
  })

  test("shows fallback if hero or opponent missing", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: {} }]}>
        <Battle />
      </MemoryRouter>
    )

    expect(screen.getByText(/No hero or opponent selected/i)).toBeInTheDocument()
  })
})