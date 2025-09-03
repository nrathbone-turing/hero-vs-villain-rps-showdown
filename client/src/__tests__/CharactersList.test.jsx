// CharactersList.test.jsx
// Tests the Characters page list view with mocked fetch.

import React from 'react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Characters from '../pages/Characters'

// Reset fetch before each test
beforeEach(() => {
  global.fetch = vi.fn()
})

const mockHeroes = [
  { id: 70, name: "Batman", powerstats: { strength: "50" } },
  { id: 644, name: "Superman", powerstats: { strength: "1000" } },
  { id: 720, name: "Wonder Woman", powerstats: { strength: "85" } },
  { id: 620, name: "Spider-Man", powerstats: { strength: "55" } }
]

describe("Characters page (list view)", () => {
  test("shows loading state while fetching /api/popular-heroes", () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeroes,
    })

    render(<Characters />)
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test("renders multiple heroes after successful fetch from /api/popular-heroes", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeroes,
    })

    render(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/Batman/i)).toBeInTheDocument()
      expect(screen.getByText(/Superman/i)).toBeInTheDocument()
      expect(screen.getByText(/Wonder Woman/i)).toBeInTheDocument()
      expect(screen.getByText(/Spider-Man/i)).toBeInTheDocument()
    })
  })

  test("shows error message if /api/popular-heroes request fails", async () => {
    fetch.mockRejectedValueOnce(new Error("API error"))

    render(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/error fetching heroes/i)).toBeInTheDocument()
    })
  })

  test("renders Select buttons for each hero in the list", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeroes,
    })

    render(<Characters />)

    await waitFor(() => {
      const buttons = screen.getAllByRole("button", { name: /select/i })
      expect(buttons).toHaveLength(mockHeroes.length)
    })
  })
})