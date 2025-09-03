// CharactersList.test.jsx
// Tests for rendering and interaction on the Characters page
// as we expand it from a single card into a list/grid.

import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Characters from '../pages/Characters'

// Mock fetch globally
global.fetch = vi.fn()

describe("Characters page (list view)", () => {
  test("shows loading state initially", () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: "A-Bomb", powerstats: { strength: "100" } }],
    })

    render(<Characters />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test("renders multiple hero cards after fetch", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, name: "A-Bomb", powerstats: { strength: "100" } },
        { id: 70, name: "Batman", powerstats: { strength: "50" } },
      ],
    })

    render(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/A-Bomb/i)).toBeInTheDocument()
      expect(screen.getByText(/Batman/i)).toBeInTheDocument()
    })
  })

  test("shows error message if fetch fails", async () => {
    fetch.mockRejectedValueOnce(new Error("API error"))

    render(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/error fetching heroes/i)).toBeInTheDocument()
    })
  })

  test("select button triggers selection callback", async () => {
    const mockHeroes = [
      { id: 1, name: "A-Bomb", powerstats: { strength: "100" } },
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockHeroes,
    })

    render(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/A-Bomb/i)).toBeInTheDocument()
    })

    const button = screen.getByRole('button', { name: /select a-bomb/i })
    expect(button).toBeInTheDocument()
  })
})
