import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Characters from "../pages/Characters"
import Battle from "../pages/Battle"
import { vi } from "vitest"

const mockHero = { id: 1, name: "Superman", image: "superman.jpg", powerstats: { strength: 100 } }
const mockOpponent = { id: 2, name: "Batman", image: "batman.jpg", powerstats: { strength: 26 } }

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [mockHero, mockOpponent],
  })
})

test("renders consistent hero and opponent image sizing on Battle page", async () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/battle", state: { hero: mockHero } }]}>
      <Battle />
    </MemoryRouter>
  )

  const images = await screen.findAllByRole("img")
  images.forEach(img => {
    expect(img).toHaveStyle("height: 325px")
    expect(img).toHaveStyle("object-fit: cover")
  })
})

test("renders consistent card images on Characters page", async () => {
  render(
    <MemoryRouter>
      <Characters />
    </MemoryRouter>
  )

  const images = await screen.findAllByRole("img")
  images.forEach(img => {
    expect(img).toHaveStyle("height: 250px")
    expect(img).toHaveStyle("object-fit: cover")
  })
})