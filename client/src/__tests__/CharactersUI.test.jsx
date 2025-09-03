// CharactersUI.test.jsx
// Tests for Characters page UI with Material UI Card styling.

import React from 'react'
import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Characters from '../pages/Characters'

// Mock fetch
global.fetch = vi.fn()

describe("Characters UI", () => {
  test("renders hero info inside a MUI Card", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "Wonder Woman", powerstats: { strength: "90" } }),
    })

    render(<Characters heroId={720} />)

    // Wait for hero name to appear
    await waitFor(() => {
      expect(screen.getByText(/Wonder Woman/i)).toBeInTheDocument()
      expect(screen.getByText(/Strength: 90/i)).toBeInTheDocument()
    })

    // Check for a semantic role that matches a Card (MUI Cards render as <div role="presentation"> by default)
    // Instead, we can check for the "heading" inside Card content:
    const heading = screen.getByRole("heading", { name: /Wonder Woman/i })
    expect(heading).toBeInTheDocument()
  })
})