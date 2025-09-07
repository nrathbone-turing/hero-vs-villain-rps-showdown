// CharactersList.test.jsx
// Tests the Characters page list view with mocked fetch.

import React from 'react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Characters from '../pages/Characters'

// Reset fetch before each test
beforeEach(() => {
  global.fetch = vi.fn()
})

const mockHeroes = [
  { id: 70, name: "Batman", image: "batman.jpg", powerstats: { strength: "50" } },
  { id: 644, name: "Superman", image: "superman.jpg", powerstats: { strength: "1000" } },
  { id: 720, name: "Wonder Woman", image: "wonderwoman.jpg", powerstats: { strength: "85" } },
  { id: 620, name: "Spider-Man", image: "spiderman.jpg", powerstats: { strength: "55" } }
]

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe("Characters page (list view)", () => {
  test("shows loading state while fetching /api/popular-heroes", () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeroes,
    })

    renderWithRouter(<Characters />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test("renders multiple heroes after successful fetch from /api/popular-heroes", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeroes,
    })

    renderWithRouter(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/Batman/i)).toBeInTheDocument()
      expect(screen.getByText(/Superman/i)).toBeInTheDocument()
      expect(screen.getByText(/Wonder Woman/i)).toBeInTheDocument()
      expect(screen.getByText(/Spider-Man/i)).toBeInTheDocument()
    })
  })

  test("shows error message if /api/popular-heroes request fails", async () => {
    fetch.mockRejectedValueOnce(new Error("API error"))

    renderWithRouter(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/error fetching heroes/i)).toBeInTheDocument()
    })
  })

  test("renders Select buttons for each hero in the list", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeroes,
    })

    renderWithRouter(<Characters />)

    await waitFor(() => {
      const buttons = screen.getAllByRole("button", { name: /select/i })
      expect(buttons).toHaveLength(mockHeroes.length)
    })
  })

  test("renders all hero powerstats after fetch", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
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
        },
      ],
    })

    renderWithRouter(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/Batman/i)).toBeInTheDocument()
      expect(screen.getByText(/Intelligence: 100/i)).toBeInTheDocument()
      expect(screen.getByText(/Strength: 26/i)).toBeInTheDocument()
      expect(screen.getByText(/Speed: 27/i)).toBeInTheDocument()
      expect(screen.getByText(/Durability: 50/i)).toBeInTheDocument()
      expect(screen.getByText(/Power: 47/i)).toBeInTheDocument()
      expect(screen.getByText(/Combat: 100/i)).toBeInTheDocument()
    })
  })

  test("renders hero images if provided", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeroes,
    })

    renderWithRouter(<Characters />)

    await waitFor(() => {
      const images = screen.getAllByRole("img")
      expect(images).toHaveLength(mockHeroes.length)
      expect(images[0]).toHaveAttribute("src", "batman.jpg")
    })
  })

  test("renders Characters heading with test id", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeroes,
    })

    renderWithRouter(<Characters />)
    expect(await screen.findByTestId("characters-heading")).toBeInTheDocument()
  })

})