// Battle.test.jsx
// Tests for Battle page showing selected hero vs random opponent.

import React from "react"
import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Battle from "../pages/Battle"

const mockHeroes = [
  {
    id: 70,
    name: "Batman",
    image: "batman.jpg",
    powerstats: { strength: "50" },
  },
  {
    id: 644,
    name: "Superman",
    image: "superman.jpg",
    powerstats: { strength: "1000" },
  },
]

beforeEach(() => {
  global.fetch = vi.fn().mockImplementation((url) => {
    if (url.includes("/popular-heroes")) {
      return Promise.resolve({
        ok: true,
        json: async () => [mockHeroes[0], mockHeroes[1]],
      })
    }
    // fallback for /hero/:id
    return Promise.resolve({
      ok: true,
      json: async () => mockHeroes[1], // Superman
    })
  })
})

describe("Battle page", () => {
  test("shows selected hero details and opponent after fetch", async () => {
    const hero = mockHeroes[0] // Batman

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    // Hero should render
    expect(await screen.findByTestId("hero-name")).toHaveTextContent("Batman")
    expect(screen.getByText(/Strength: 50/i)).toBeInTheDocument()
    expect(screen.getByRole("img", { name: /batman/i })).toHaveAttribute("src", "batman.jpg")

    // Opponent should render
    expect(await screen.findByTestId("opponent-name")).toHaveTextContent("Superman")
    expect(screen.getByText(/Strength: 1000/i)).toBeInTheDocument()
    expect(screen.getByRole("img", { name: /superman/i })).toHaveAttribute("src", "superman.jpg")
  })

  test("shows error if opponent fetch fails", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("API error"))

    const hero = mockHeroes[0]

    render(
      <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero } }]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText(/error fetching opponent/i)).toBeInTheDocument()
  })

  test("shows message if no hero is selected", () => {
    render(
      <MemoryRouter initialEntries={["/battle"]}>
        <Routes>
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText(/no hero selected/i)).toBeInTheDocument()
  })
})
