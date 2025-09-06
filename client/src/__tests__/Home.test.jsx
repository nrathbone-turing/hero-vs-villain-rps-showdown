// Home.test.jsx
// Tests for the Home page: renders welcome text and Get Started button.

import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Home from "../pages/Home"

describe("Home page", () => {
  test("renders welcome message", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    expect(
      screen.getByText(/Welcome to Hero vs Villain Showdown/i)
    ).toBeInTheDocument()
  })

  test("renders Get Started button", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    expect(screen.getByTestId("get-started-btn")).toBeInTheDocument()
  })
})