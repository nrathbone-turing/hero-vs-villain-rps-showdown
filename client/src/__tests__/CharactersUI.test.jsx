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

    await waitFor(() => {
        expect(screen.getByText(/Wonder Woman/i)).toBeInTheDocument()
        expect(screen.getByText(/Strength: 90/i)).toBeInTheDocument()
    })

    // Ensure the MUI Card container exists
    expect(screen.getByTestId("hero-card")).toBeInTheDocument()
    })
})