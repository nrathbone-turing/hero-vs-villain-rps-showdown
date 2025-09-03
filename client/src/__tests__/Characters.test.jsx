// Characters.test.jsx
// Tests for fetching and displaying hero data.

import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Characters from '../pages/Characters'

// Mock fetch
global.fetch = vi.fn()

describe("Characters page", () => {
  test("shows loading state initially", () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "Superman", powerstats: { strength: "100" } }),
    })

    render(<Characters />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test("displays hero data after fetch", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "Superman", powerstats: { strength: "100" } }),
    })

    render(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/Superman/i)).toBeInTheDocument()
      expect(screen.getByText(/Strength: 100/i)).toBeInTheDocument()
    })
  })

  test("shows error message if fetch fails", async () => {
    fetch.mockRejectedValueOnce(new Error("API error"))

    render(<Characters />)

    await waitFor(() => {
      expect(screen.getByText(/error fetching hero/i)).toBeInTheDocument()
    })
  })
})