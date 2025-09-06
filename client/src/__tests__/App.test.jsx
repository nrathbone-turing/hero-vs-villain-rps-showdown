// App.test.jsx
// Tests for top-level navigation only.

import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import App from "../App"
import { vi } from "vitest"

const mockHeroes = [
  { id: 1, name: "Batman", image: "batman.jpg", powerstats: { strength: 50 } },
  { id: 2, name: "Superman", image: "superman.jpg", powerstats: { strength: 1000 } },
]

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockHeroes,
  })
})

describe("App routing and navigation", () => {
  test("navigates to Characters page when clicking Characters", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByTestId("nav-characters"))

    // Characters heading should appear once fetch resolves
    expect(await screen.findByTestId("characters-heading")).toBeInTheDocument()
  })

  test("navigates to Home page when clicking Home", async () => {
    render(
      <MemoryRouter initialEntries={["/characters"]}>
        <App />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByTestId("nav-home"))
    expect(await screen.findByTestId("get-started-btn")).toBeInTheDocument()
  })

  test("shows fallback when navigating to Battle with no hero", async () => {
    render(
      <MemoryRouter initialEntries={["/battle"]}>
        <App />
      </MemoryRouter>
    )

    expect(await screen.findByText(/No hero selected/i)).toBeInTheDocument()
  })
})