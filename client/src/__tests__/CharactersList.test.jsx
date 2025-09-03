// CharactersList.test.jsx
// Tests for Characters page list/grid rendering with MUI Cards.

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
      json: async () => [],
    })

    render(<Characters />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test("renders multiple hero cards after fetch", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 70, name: "Batman", powerstats: { strength: "50" } },
        { id: 644, name: "Superman", powerstats: { strength: "100" } },
      ],
    })

    render(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/Batman/i)).toBeInTheDocument()
      expect(screen.getByText(/Superman/i)).toBeInTheDocument()
    })

    // Ensure MUI Card containers exist
    expect(screen.getAllByTestId(/hero-card/).length).toBeGreaterThan(1)
  })

  test("shows error message if fetch fails", async () => {
    fetch.mockRejectedValueOnce(new Error("API error"))

    render(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/error fetching heroes/i)).toBeInTheDocument()
    })
  })

  test("includes Select buttons for each hero", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 720, name: "Wonder Woman", powerstats: { strength: "85" } },
      ],
    })

    render(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/Wonder Woman/i)).toBeInTheDocument()
    })

    const button = screen.getByRole('button', { name: /select wonder woman/i })
    expect(button).toBeInTheDocument()
  })
})