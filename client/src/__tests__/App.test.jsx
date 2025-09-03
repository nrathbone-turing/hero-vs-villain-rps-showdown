// App.test.jsx
// Basic routing tests to confirm navigation works.

import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

describe("App routing", () => {
  test("renders Home page by default", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    expect(screen.getByText(/Hero vs Villain Showdown/i)).toBeInTheDocument()
  })

  test("renders navigation links", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    expect(screen.getByText(/Home/i)).toBeInTheDocument()
    expect(screen.getByText(/Characters/i)).toBeInTheDocument()
    expect(screen.getByText(/Battle/i)).toBeInTheDocument()
  })
})
