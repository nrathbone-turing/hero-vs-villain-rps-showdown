// HeroSelection.test.jsx
// Tests navigation flow from Characters -> Battle after selecting a hero.

import React from "react"
import { describe, test, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"

// Try to use userEvent if available, otherwise fallback to fireEvent
let userEvent
try {
  userEvent = require("@testing-library/user-event").default
} catch {
  userEvent = {
    click: (el) => fireEvent.click(el),
  }
}

import { MemoryRouter, Routes, Route } from "react-router-dom"
import Characters from "../pages/Characters"
import Battle from "../pages/Battle"

// Mock API data
const mockHeroes = [
  { id: 70, name: "Batman", image: "batman.jpg", powerstats: { strength: "50" } },
  { id: 644, name: "Superman", image: "superman.jpg", powerstats: { strength: "1000" } },
]

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockHeroes,
  })
})

describe("Hero selection flow", () => {
  test("navigates to Battle page and shows selected hero", async () => {
  render(
    <MemoryRouter initialEntries={["/characters"]}>
      <Routes>
        <Route path="/characters" element={<Characters />} />
        <Route path="/battle" element={<Battle />} />
      </Routes>
    </MemoryRouter>
  )

  // Wait for heroes
  await waitFor(() => {
    expect(screen.getByText(/Batman/i)).toBeInTheDocument()
  })

  // Click select
  const batmanButton = screen.getByRole("button", { name: /select batman/i })
  await userEvent.click(batmanButton)

  // Assert Battle page shows hero details
  await waitFor(() => {
    expect(screen.getByText(/Selected Hero: Batman/i)).toBeInTheDocument()
    expect(screen.getByText(/Strength: 50/i)).toBeInTheDocument()
  })
})
})